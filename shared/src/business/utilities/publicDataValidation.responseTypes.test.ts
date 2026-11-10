import { findUnauthorizedPublicFields } from '@shared/business/utilities/publicDataValidation';
import { FeatureFlagResponseDTO } from '@shared/business/dto/system/FeatureFlagResponseDTO';
import { PublicCaseSearchResult } from '@shared/business/entities/cases/PublicCaseSearchResult';
import { PublicContact } from '@shared/business/entities/cases/PublicContact';
import { PublicDocketEntry } from '@shared/business/entities/cases/PublicDocketEntry';
import { PublicDocumentSearchResult } from '@shared/business/entities/documents/PublicDocumentSearchResult';

describe('publicDataValidation response types', () => {
  it('passes for feature-flag primitive payloads', () => {
    const dto = new FeatureFlagResponseDTO({
      'aws-batch-zipper-minimum-count': 5,
      'chief-judge-name': 'Bootsy Collins',
      'document-visibility-policy-change-date': '2023-05-01',
      'e-consent-fields-enabled-feature-flag': true,
      'restricted-event-codes': ['something'],
      'use-change-of-address-lambda': false,
    });
    dto.validate();

    expect(
      findUnauthorizedPublicFields({
        data: dto,
        url: 'http://localhost:4001/system/feature-flag',
      }),
    ).toEqual([]);
  });

  it('rejects URL-only objects in arrays without a public entity schema', () => {
    const findings = findUnauthorizedPublicFields({
      data: [{ url: 'https://example.com/doc.pdf' }],
      url: 'http://localhost:4001/public-api/documents',
    });

    expect(findings).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          fieldName: '[0].entityName',
          matchPreview: '[missing]',
        }),
      ]),
    );
  });

  it('passes validated public case search results with approved string arrays', () => {
    const result = new PublicCaseSearchResult({
      caseCaption: 'Test Petitioner, Petitioner',
      docketNumber: '101-20',
      docketNumberWithSuffix: '101-20',
      petitionerNames: ['Test Petitioner'],
      petitionerStateNames: ['California'],
      receivedAt: '2020-01-05T03:30:45.007Z',
    }).validate();

    expect(
      findUnauthorizedPublicFields({
        data: { results: [result] },
        url: 'http://localhost:4001/public-api/search',
      }),
    ).toEqual([]);
  });

  it('rejects non-string values in public case search result arrays', () => {
    const result = new PublicCaseSearchResult({
      caseCaption: 'Test Petitioner, Petitioner',
      docketNumber: '101-20',
      docketNumberWithSuffix: '101-20',
      petitionerNames: ['Test Petitioner'],
      petitionerStateNames: ['California'],
      receivedAt: '2020-01-05T03:30:45.007Z',
    }).validate();
    Object.assign(result, { petitionerNames: [123] });

    const findings = findUnauthorizedPublicFields({
      data: { results: [result] },
      url: 'http://localhost:4001/public-api/search',
    });

    expect(findings).toEqual([
      expect.objectContaining({
        fieldName: 'results[0].petitionerNames[0]',
        matchPreview: '[invalid]',
      }),
    ]);
  });

  it('passes each response wrapper with its expected validated entity type', () => {
    const docketEntry = new PublicDocketEntry({
      docketNumber: '101-20',
      filingDate: '2020-01-05T03:30:45.007Z',
      isSealed: false,
      receivedAt: '2020-01-05T03:30:45.007Z',
    }).validate();
    const caseSearchResult = new PublicCaseSearchResult({
      caseCaption: 'Test Petitioner, Petitioner',
      docketNumber: '101-20',
      docketNumberWithSuffix: '101-20',
      petitionerNames: ['Test Petitioner'],
      petitionerStateNames: ['California'],
      receivedAt: '2020-01-05T03:30:45.007Z',
    }).validate();
    const documentSearchResult = new PublicDocumentSearchResult({
      caseCaption: 'Test Petitioner, Petitioner',
      docketEntryId: 'c7d90c05-f6cd-442c-a168-202db587f16f',
      docketNumber: '101-20',
      documentTitle: 'Order',
      filingDate: '2020-01-05T03:30:45.007Z',
    }).validate();
    const practitioner = new PublicContact({
      contactId: 'c7d90c05-f6cd-442c-a168-202db587f16f',
    }).validate();
    const responses = [
      {
        docketEntries: [docketEntry],
        page: 0,
        pageSize: 1000,
        totalCount: 1,
      },
      { results: [caseSearchResult] },
      { results: [documentSearchResult] },
      { results: [documentSearchResult], totalCount: 1 },
      {
        searchResults: {
          lastKey: [null, 'smith', 'SB1234'],
          practitioners: [practitioner],
          total: 1,
        },
      },
    ];

    for (const data of responses) {
      expect(
        findUnauthorizedPublicFields({
          data,
          url: 'http://localhost:4001/public-api/search',
        }),
      ).toEqual([]);
    }
  });

  it('rejects unsupported values in practitioner sort cursors', () => {
    const findings = findUnauthorizedPublicFields({
      data: {
        searchResults: {
          lastKey: [null, { invalid: true }],
          practitioners: [],
          total: 0,
        },
      },
      url: 'http://localhost:4001/public-api/practitioners',
    });

    expect(findings).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          fieldName: 'searchResults.lastKey[1]',
          matchPreview: '[invalid]',
        }),
      ]),
    );
  });

  it('reports missing required fields in public response wrappers', () => {
    const findings = findUnauthorizedPublicFields({
      data: {
        searchResults: {
          lastKey: [],
          practitioners: [],
        },
      },
      url: 'http://localhost:4001/public-api/practitioners',
    });

    expect(findings).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          fieldName: 'searchResults.total',
          matchPreview: '[missing]',
        }),
      ]),
    );
  });

  it.each([
    JSON.stringify({ privateField: 'do-not-leak' }),
    'synthetic-private-value',
    123456789,
    null,
    true,
  ])('rejects unsupported scalar response values: %s', data => {
    const findings = findUnauthorizedPublicFields({
      data,
      url: 'http://localhost:4001/public-api/metrics',
    });

    expect(findings).toEqual([
      expect.objectContaining({
        fieldName: 'response',
        matchPreview: '[invalid]',
      }),
    ]);
  });

  it('rejects primitive values in public response arrays', () => {
    const findings = findUnauthorizedPublicFields({
      data: ['synthetic-private-value'],
      url: 'http://localhost:4001/public-api/users',
    });

    expect(findings).toEqual([
      expect.objectContaining({
        fieldName: '[0]',
        matchPreview: '[invalid]',
      }),
    ]);
  });

  it('allows only documented boolean and empty public responses', () => {
    expect(
      findUnauthorizedPublicFields({
        data: false,
        method: 'GET',
        url: 'http://localhost:4001/public-api/maintenance-mode',
      }),
    ).toEqual([]);
    expect(
      findUnauthorizedPublicFields({
        data: true,
        method: 'HEAD',
        url: 'http://localhost:4001/public-api/cases/101-20',
      }),
    ).toEqual([]);
    expect(
      findUnauthorizedPublicFields({
        data: undefined,
        method: 'PUT',
        url: 'http://localhost:4001/public-api/verify-email',
      }),
    ).toEqual([]);
    expect(
      findUnauthorizedPublicFields({
        data: true,
        method: 'GET',
        url: 'http://localhost:4001/public-api/cases/101-20',
      }),
    ).toEqual([
      expect.objectContaining({
        fieldName: 'response',
        matchPreview: '[invalid]',
      }),
    ]);
  });
});
