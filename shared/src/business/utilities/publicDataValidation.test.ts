import { findUnauthorizedPublicFields } from '@shared/business/utilities/publicDataValidation';

describe('publicDataValidation', () => {
  it('passes for feature-flag primitive payloads', () => {
    const findings = findUnauthorizedPublicFields({
      data: {
        entityName: 'FeatureFlagResponseDTO',
        'aws-batch-zipper-minimum-count': 5,
        'chief-judge-name': 'Bootsy Collins',
        'document-visibility-policy-change-date': '2023-05-01',
        'e-consent-fields-enabled-feature-flag': true,
        'restricted-event-codes': ['something'],
        'use-change-of-address-lambda': false,
      },
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

  it('fails on unauthorized fields for known public entities', () => {
    const findings = findUnauthorizedPublicFields({
      data: {
        entityName: 'PublicUser',
        privateField: 'do-not-leak',
      },
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
});
