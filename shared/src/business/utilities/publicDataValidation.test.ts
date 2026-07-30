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
});
