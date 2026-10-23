import { findUnauthorizedPublicFields } from '@shared/business/utilities/publicDataValidation';
import { FeatureFlagResponseDTO } from '@shared/business/dto/system/FeatureFlagResponseDTO';
import { PublicCaseResponse } from '@shared/business/dto/cases/PublicCaseResponse';
import { HealthCheckResponse } from '@shared/business/dto/public/HealthCheckResponse';
import { PublicContact } from '@shared/business/entities/cases/PublicContact';
import { PublicDocketEntry } from '@shared/business/entities/cases/PublicDocketEntry';
import { PublicUser } from '@shared/business/entities/PublicUser';
import { PARTY_TYPES } from '@shared/business/entities/EntityConstants';
import { PublicTrialSessionInfo } from '@shared/business/dto/trialSessions/PublicTrialSessionInfo';
import { PublicTrialSessionDetails } from '@shared/business/entities/trialSessions/PublicTrialSessionDetails';
import { RestrictedCaseResponse } from '@shared/business/dto/cases/RestrictedCaseResponse';

const MOCK_UUID = 'c7d90c05-f6cd-442c-a168-202db587f16f';

const mockPublicCaseFields = {
  caseCaption: 'Test Petitioner, Petitioner',
  docketEntries: [],
  docketNumber: '101-20',
  docketNumberWithSuffix: '101-20',
  hasIrsPractitioner: false,
  isSealed: false,
  receivedAt: '2020-01-05T03:30:45.007Z',
  partyType: PARTY_TYPES.petitioner,
};

describe('publicDataValidation', () => {
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
    const findings = findUnauthorizedPublicFields({
      data: dto,
      url: 'http://localhost:4001/system/feature-flag',
    });

    expect(findings).toEqual([]);
  });

  it('fails top-level array items without entityName', () => {
    const findings = findUnauthorizedPublicFields({
      data: [
        {
          isCalendared: true,
          sessionStatus: 'Open',
          sessionType: 'Special',
          startDate: '2019-12-02T05:00:00.000Z',
          term: 'Fall',
          termYear: '2019',
          trialLocation: 'Denver, Colorado',
          trialSessionId: '0d943468-bc2e-4631-84e3-b084cf5b1fbb',
        },
      ],
      url: 'http://localhost:4001/public-api/trial-sessions',
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

  it('passes for top-level array items that are URL-only objects', () => {
    const findings = findUnauthorizedPublicFields({
      data: [{ url: 'https://example.com/doc.pdf' }],
      url: 'http://localhost:4001/public-api/documents',
    });

    expect(findings).toEqual([]);
  });

  it('rejects root numeric payloads without an approved response schema', () => {
    const findings = findUnauthorizedPublicFields({
      data: {
        privateIdentifier: 123456789,
      },
      url: 'http://localhost:4001/public-api/metrics',
    });

    expect(findings).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          fieldName: 'entityName',
          matchPreview: '[missing]',
        }),
      ]),
    );
  });

  it('rejects untagged nested objects without an approved schema', () => {
    const findings = findUnauthorizedPublicFields({
      data: {
        container: {
          privateField: 'synthetic-sensitive-value',
        },
      },
      url: 'http://localhost:4001/public-api/nested',
    });

    expect(findings).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          fieldName: 'container.entityName',
          matchPreview: '[missing]',
        }),
      ]),
    );
  });

  it('rejects unvalidated entities inside plain-object properties', () => {
    const user = new PublicUser({ name: 'Test User', role: 'petitioner' });
    const findings = findUnauthorizedPublicFields({
      data: { result: user },
      url: 'http://localhost:4001/public-api/nested',
    });

    expect(findings).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          entityName: 'PublicUser',
          fieldName: 'result.isValidated',
          matchPreview: '[not validated]',
          type: 'not_validated',
        }),
      ]),
    );
  });

  it('fails on unauthorized fields for known public entities', () => {
    const user = new PublicUser({ name: 'Test User', role: 'petitioner' });
    user.validate();
    (user as any).privateField = 'do-not-leak';
    const findings = findUnauthorizedPublicFields({
      data: user,
      url: 'http://localhost:4001/public-api/users',
    });

    expect(findings).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          entityName: 'PublicUser',
          fieldName: 'privateField',
        }),
      ]),
    );
  });

  it('fails for root entities that have not been validated', () => {
    const user = new PublicUser({ name: 'Test User', role: 'petitioner' });
    const findings = findUnauthorizedPublicFields({
      data: user,
      url: 'http://localhost:4001/public-api/users',
    });

    expect(findings).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          entityName: 'PublicUser',
          fieldName: 'isValidated',
          matchPreview: '[not validated]',
          type: 'not_validated',
        }),
      ]),
    );
  });

  it('fails for array entities that have not been validated', () => {
    const user = new PublicUser({ name: 'Test User', role: 'petitioner' });
    const findings = findUnauthorizedPublicFields({
      data: [user],
      url: 'http://localhost:4001/public-api/users',
    });

    expect(findings).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          entityName: 'PublicUser',
          fieldName: '[0].isValidated',
          matchPreview: '[not validated]',
          type: 'not_validated',
        }),
      ]),
    );
  });

  it('passes for array entities that have been validated', () => {
    const user = new PublicUser({ name: 'Test User', role: 'petitioner' });
    user.validate();
    const findings = findUnauthorizedPublicFields({
      data: [user],
      url: 'http://localhost:4001/public-api/users',
    });

    expect(findings).toEqual([]);
  });

  it('passes for unvalidated entities within arrays nested inside a validated entity', () => {
    const publicCase = new PublicCaseResponse({
      ...mockPublicCaseFields,
      petitioners: [new PublicContact({ contactId: MOCK_UUID })],
    } as any);
    publicCase.validate();

    const findings = findUnauthorizedPublicFields({
      data: publicCase,
      url: 'http://localhost:4001/public-api/cases/101-20',
    });

    expect(findings).toEqual([]);
  });

  it('passes for validated docket entries with approved relationship objects', () => {
    const docketEntry = new PublicDocketEntry({
      affectedByDocketEntries: [
        { docketEntryId: MOCK_UUID, disposition: 'GRANTED' },
      ],
      affectedDocketEntries: [
        { docketEntryId: MOCK_UUID, disposition: 'DENIED' },
      ],
      docketNumber: '101-20',
      filingDate: '2020-01-05T03:30:45.007Z',
      isSealed: false,
      previousDocument: {
        docketEntryId: MOCK_UUID,
        documentTitle: 'Order',
        documentType: 'Order',
      },
      receivedAt: '2020-01-05T03:30:45.007Z',
    });
    docketEntry.validate();

    const findings = findUnauthorizedPublicFields({
      data: docketEntry,
      url: 'http://localhost:4001/public-api/cases/101-20/docket',
    });

    expect(findings).toEqual([]);
  });

  it('passes for the explicit public docket-entry page response schema', () => {
    const docketEntry = new PublicDocketEntry({
      docketNumber: '101-20',
      filingDate: '2020-01-05T03:30:45.007Z',
      isSealed: false,
      receivedAt: '2020-01-05T03:30:45.007Z',
    }).validate();

    const findings = findUnauthorizedPublicFields({
      data: {
        docketEntries: [docketEntry],
        page: 0,
        pageSize: 1000,
        totalCount: 1,
      },
      url: 'http://localhost:4001/public-api/cases/101-20/docket-entries',
    });

    expect(findings).toEqual([]);
  });

  it('passes for approved search, report, and practitioner response wrappers', () => {
    const results = [
      { results: [] },
      { results: [], totalCount: 0 },
      {
        searchResults: {
          lastKey: ['bar-number', 1],
          practitioners: [],
          total: 0,
        },
      },
    ];

    for (const data of results) {
      expect(
        findUnauthorizedPublicFields({
          data,
          url: 'http://localhost:4001/public-api/search',
        }),
      ).toEqual([]);
    }
  });

  it('recognizes public entity arrays inside approved result wrappers', () => {
    const findings = findUnauthorizedPublicFields({
      data: {
        results: [{ entityName: 'PublicDocumentSearchResult' }],
      },
      url: 'http://localhost:4001/public-api/order-search',
    });

    expect(findings).toEqual([
      expect.objectContaining({
        entityName: 'PublicDocumentSearchResult',
        fieldName: 'results[0].isValidated',
        type: 'not_validated',
      }),
    ]);
  });

  it('rejects unauthorized values and extra fields inside approved wrappers', () => {
    const findings = findUnauthorizedPublicFields({
      data: {
        results: [
          {
            entityName: 'PublicDocumentSearchResult',
            isValidated: true,
            privateField: 'do-not-leak',
          },
        ],
        totalCount: 1,
      },
      url: 'http://localhost:4001/public-api/order-search',
    });

    expect(findings).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          fieldName: 'results[0].privateField',
          entityName: 'PublicDocumentSearchResult',
        }),
      ]),
    );

    const extraFieldFindings = findUnauthorizedPublicFields({
      data: {
        results: [],
        totalCount: 0,
        privateField: 'do-not-leak',
      },
      url: 'http://localhost:4001/public-api/order-search',
    });

    expect(extraFieldFindings).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          fieldName: 'entityName',
          matchPreview: '[missing]',
        }),
      ]),
    );
  });

  it('does not allow internal consolidated-case summaries as public entities', () => {
    const findings = findUnauthorizedPublicFields({
      data: {
        entityName: 'ConsolidatedCaseSummary',
        isValidated: true,
        docketNumber: '101-20',
        status: 'New',
        blocked: true,
      },
      url: 'http://localhost:4001/public-api/cases/101-20',
    });

    expect(findings).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          entityName: 'ConsolidatedCaseSummary',
          fieldName: 'entityName',
        }),
      ]),
    );
  });

  it('rejects unauthorized fields on nested calendared case responses', () => {
    const calendaredCase = new RestrictedCaseResponse({
      docketNumber: '101-20',
      docketEntries: [],
    });
    Object.assign(calendaredCase, { privateField: 'do-not-leak' });
    const trialSessionDetails = new PublicTrialSessionDetails({
      calendaredCases: [calendaredCase],
      startDate: '2026-01-01T00:00:00.000Z',
    }).validate();

    const findings = findUnauthorizedPublicFields({
      data: trialSessionDetails,
      url: 'http://localhost:4001/public-api/trial-sessions/abc',
    });

    expect(findings).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          entityName: 'RestrictedCaseResponse',
          fieldName: 'calendaredCases[0].privateField',
        }),
      ]),
    );
  });

  it('passes for validated docket entries with optional previous-document fields omitted', () => {
    const docketEntry = new PublicDocketEntry({
      docketNumber: '101-20',
      filingDate: '2020-01-05T03:30:45.007Z',
      isSealed: false,
      previousDocument: {},
      receivedAt: '2020-01-05T03:30:45.007Z',
    }).validate();

    const findings = findUnauthorizedPublicFields({
      data: docketEntry,
      url: 'http://localhost:4001/public-api/cases/101-20/docket',
    });

    expect(findings).toEqual([]);
  });

  it('rejects unapproved fields inside docket-entry relationship objects', () => {
    const relationshipWithPrivateField = {
      docketEntryId: MOCK_UUID,
      disposition: 'DENIED',
      privateField: 'do-not-leak',
    };
    const docketEntry = new PublicDocketEntry({
      affectedDocketEntries: [relationshipWithPrivateField],
      docketNumber: '101-20',
      filingDate: '2020-01-05T03:30:45.007Z',
      isSealed: false,
      receivedAt: '2020-01-05T03:30:45.007Z',
    });

    const findings = findUnauthorizedPublicFields({
      data: docketEntry,
      url: 'http://localhost:4001/public-api/cases/101-20/docket',
    });

    expect(findings).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          fieldName: 'affectedDocketEntries[0].privateField',
          matchPreview: '[invalid]',
        }),
      ]),
    );
  });

  it('rejects malformed docket-entry relationship values', () => {
    const docketEntryFields = {
      docketNumber: '101-20',
      filingDate: '2020-01-05T03:30:45.007Z',
      isSealed: false,
      receivedAt: '2020-01-05T03:30:45.007Z',
    };
    const newDocketEntry = () => new PublicDocketEntry(docketEntryFields);
    const findings = [
      Object.assign(newDocketEntry(), { affectedDocketEntries: {} }),
      Object.assign(newDocketEntry(), { affectedByDocketEntries: [null] }),
      Object.assign(newDocketEntry(), {
        affectedByDocketEntries: [{ docketEntryId: MOCK_UUID }],
      }),
    ].flatMap(docketEntry =>
      findUnauthorizedPublicFields({
        data: docketEntry,
        url: 'http://localhost:4001/public-api/cases/101-20/docket',
      }),
    );

    expect(findings).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          fieldName: 'affectedDocketEntries',
          matchPreview: '[invalid]',
        }),
        expect.objectContaining({
          fieldName: 'affectedByDocketEntries[0]',
          matchPreview: '[invalid]',
        }),
        expect.objectContaining({
          fieldName: 'affectedByDocketEntries[0].disposition',
          matchPreview: '[missing]',
        }),
      ]),
    );
  });

  it('passes for health-check and trial-session value objects with approved fields', () => {
    const healthCheckResponse = new HealthCheckResponse({
      cognito: true,
      elasticsearch: true,
      emailService: true,
      s3: {
        app: true,
        appFailover: true,
        eastDocuments: true,
        eastTempDocuments: true,
        public: true,
        publicFailover: true,
        westDocuments: true,
        westTempDocuments: true,
      },
    }).validate();
    const trialSessionInfo = new PublicTrialSessionInfo({
      isCalendared: true,
      judge: { name: 'Judge Test' },
      proceedingType: 'In Person',
      sessionScope: 'Location-based',
      sessionStatus: 'Open',
      sessionType: 'Regular',
      startDate: '2020-01-05T03:30:45.007Z',
      term: 'Fall',
      termYear: '2020',
    } as ConstructorParameters<typeof PublicTrialSessionInfo>[0]).validate();

    expect(
      findUnauthorizedPublicFields({
        data: healthCheckResponse,
        url: 'http://localhost:4001/public-api/health',
      }),
    ).toEqual([]);
    expect(
      findUnauthorizedPublicFields({
        data: trialSessionInfo,
        url: 'http://localhost:4001/public-api/trial-sessions',
      }),
    ).toEqual([]);
  });

  it('fails for unvalidated entities within arrays nested inside a plain object', () => {
    const findings = findUnauthorizedPublicFields({
      data: {
        container: {
          petitioners: [new PublicContact({ contactId: MOCK_UUID })],
        },
      },
      url: 'http://localhost:4001/public-api/nested',
    });

    expect(findings).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          entityName: 'PublicContact',
          fieldName: 'container.petitioners[0].isValidated',
          matchPreview: '[not validated]',
          type: 'not_validated',
        }),
      ]),
    );
  });

  it('fails for unauthorized fields on entities nested inside a validated entity', () => {
    const petitioner = new PublicContact({ contactId: MOCK_UUID });
    (petitioner as any).privateField = 'do-not-leak';
    const publicCase = new PublicCaseResponse({
      ...mockPublicCaseFields,
      petitioners: [petitioner],
    } as any);
    publicCase.validate();

    const findings = findUnauthorizedPublicFields({
      data: publicCase,
      url: 'http://localhost:4001/public-api/cases/101-20',
    });

    expect(findings).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          entityName: 'PublicContact',
          fieldName: 'petitioners[0].privateField',
        }),
      ]),
    );
  });

  it('fails for root entities with an unrecognized entityName', () => {
    const findings = findUnauthorizedPublicFields({
      data: { entityName: 'SomeUnknownEntity', field: 'value' },
      url: 'http://localhost:4001/public-api/something',
    });

    expect(findings).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          entityName: 'SomeUnknownEntity',
          fieldName: 'entityName',
        }),
      ]),
    );
  });

  it('recurses into nested untagged objects within a known entity', () => {
    const user = new PublicUser({ name: 'Test User', role: 'petitioner' });
    user.validate();
    (user as any).nested = { entityName: 'SomeUnknownEntity', field: 'value' };
    const findings = findUnauthorizedPublicFields({
      data: user,
      url: 'http://localhost:4001/public-api/users',
    });

    expect(findings).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          entityName: 'PublicUser',
          fieldName: 'nested',
        }),
      ]),
    );
  });

  it('finds nested missing entityName in non-root objects', () => {
    const findings = findUnauthorizedPublicFields({
      data: {
        container: {
          nested: [{ foo: 'bar' }],
        },
      },
      url: 'http://localhost:4001/public-api/nested',
    });

    expect(findings).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          fieldName: 'container.nested[0].entityName',
          matchPreview: '[missing]',
        }),
      ]),
    );
  });

  it('rejects nested objects without approved schemas', () => {
    const findings = findUnauthorizedPublicFields({
      data: {
        container: {
          nested: {
            foo: 'bar',
          },
        },
      },
      url: 'http://localhost:4001/public-api/nested',
    });

    expect(findings).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          fieldName: 'container.entityName',
          matchPreview: '[missing]',
        }),
        expect.objectContaining({
          fieldName: 'container.nested.entityName',
          matchPreview: '[missing]',
        }),
      ]),
    );
  });

  it('flags unauthorized fields for nested known entities', () => {
    const findings = findUnauthorizedPublicFields({
      data: {
        container: {
          entityName: 'PublicUser',
          isValidated: true,
          privateField: 'do-not-leak',
        },
      },
      url: 'http://localhost:4001/public-api/nested',
    });

    expect(findings).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          entityName: 'PublicUser',
          fieldName: 'container.privateField',
          matchPreview: 'do-n...[redacted]...leak',
        }),
      ]),
    );
  });
});
