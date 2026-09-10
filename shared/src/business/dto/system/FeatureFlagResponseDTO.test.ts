import { FeatureFlagResponseDTO } from '@shared/business/dto/system/FeatureFlagResponseDTO';
import { ALLOWLIST_FEATURE_FLAGS } from '@shared/business/entities/EntityConstants';

describe('FeatureFlagResponseDTO', () => {
  it('is valid with no data', () => {
    const dto = new FeatureFlagResponseDTO();

    expect(dto.entityName).toBe('FeatureFlagResponseDTO');
    expect(dto.isValid()).toBe(true);
    expect(dto.getValidationErrors()).toBeNull();
  });

  it('is valid with supported primitive and array values', () => {
    const dto = new FeatureFlagResponseDTO({
      [ALLOWLIST_FEATURE_FLAGS.AWS_BATCH_ZIPPER_MINIMUM_COUNT.key]: 25,
      [ALLOWLIST_FEATURE_FLAGS.CHIEF_JUDGE_NAME.key]: 'Test Chief Judge',
      [ALLOWLIST_FEATURE_FLAGS.E_CONSENT_FIELDS_ENABLED_FEATURE_FLAG.key]: true,
      [ALLOWLIST_FEATURE_FLAGS.RESTRICTED_EVENT_CODES.key]: ['A', 'B'],
    });

    expect(dto.isValid()).toBe(true);
    expect(dto.getValidationErrors()).toBeNull();
  });

  it('is invalid when a value has an unsupported type', () => {
    const dto = new FeatureFlagResponseDTO({
      [ALLOWLIST_FEATURE_FLAGS.USE_CHANGE_OF_ADDRESS_LAMBDA.key]: {
        enabled: true,
      },
    });

    expect(dto.isValid()).toBe(false);
    expect(dto.getValidationErrors()).toEqual(
      expect.objectContaining({
        [ALLOWLIST_FEATURE_FLAGS.USE_CHANGE_OF_ADDRESS_LAMBDA.key]:
          expect.any(String),
      }),
    );
  });

  it('is invalid when it includes a non-allowlisted feature flag key', () => {
    const dto = new FeatureFlagResponseDTO({
      'not-an-allowlisted-flag': true,
    });

    expect(dto.isValid()).toBe(false);
    expect(dto.getValidationErrors()).toEqual(
      expect.objectContaining({
        'not-an-allowlisted-flag': expect.any(String),
      }),
    );
  });
});
