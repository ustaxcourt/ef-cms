import { findUnauthorizedPublicFields } from '@shared/business/utilities/publicDataValidation';
import { FeatureFlagResponseDTO } from '@shared/business/dto/system/FeatureFlagResponseDTO';
import { PublicUser } from '@shared/business/entities/PublicUser';

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

  it('passes for root numeric payloads without entityName', () => {
    const findings = findUnauthorizedPublicFields({
      data: {
        count: 2,
        threshold: 7.5,
      },
      url: 'http://localhost:4001/public-api/metrics',
    });

    expect(findings).toEqual([]);
  });

  it('fails for nonnumeric root payload values without entityName', () => {
    const findings = findUnauthorizedPublicFields({
      data: {
        status: 'bad',
      },
      url: 'http://localhost:4001/public-api/metrics',
    });

    expect(findings).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          fieldName: 'status',
          matchPreview: '[redacted]',
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

  it('finds nested missing entityName in non-root object values', () => {
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

    expect(findings).toEqual([]);
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
