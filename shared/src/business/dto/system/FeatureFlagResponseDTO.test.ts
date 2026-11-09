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
      [ALLOWLIST_FEATURE_FLAGS.DOCUMENT_VISIBILITY_POLICY_CHANGE_DATE.key]: '',
    });

    expect(dto.isValid()).toBe(true);
    expect(dto.getValidationErrors()).toBeNull();
  });

  it('is valid with false defaults for flags with non-boolean values', () => {
    const dto = new FeatureFlagResponseDTO({
      [ALLOWLIST_FEATURE_FLAGS.AWS_BATCH_ZIPPER_MINIMUM_COUNT.key]: false,
      [ALLOWLIST_FEATURE_FLAGS.CHIEF_JUDGE_NAME.key]: false,
      [ALLOWLIST_FEATURE_FLAGS.DOCUMENT_VISIBILITY_POLICY_CHANGE_DATE.key]:
        false,
      [ALLOWLIST_FEATURE_FLAGS.RESTRICTED_EVENT_CODES.key]: false,
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

  it('is invalid when a feature flag has a value with the wrong type', () => {
    const dto = new FeatureFlagResponseDTO({
      [ALLOWLIST_FEATURE_FLAGS.AWS_BATCH_ZIPPER_MINIMUM_COUNT.key]: '25',
      [ALLOWLIST_FEATURE_FLAGS.RESTRICTED_EVENT_CODES.key]: ['A', 1],
    });

    expect(dto.isValid()).toBe(false);
    expect(dto.getValidationErrors()).toEqual(
      expect.objectContaining({
        [ALLOWLIST_FEATURE_FLAGS.AWS_BATCH_ZIPPER_MINIMUM_COUNT.key]:
          expect.any(String),
        [ALLOWLIST_FEATURE_FLAGS.RESTRICTED_EVENT_CODES.key]:
          expect.any(String),
      }),
    );
  });

  it('is invalid when an array value contains an unsupported type', () => {
    const dto = new FeatureFlagResponseDTO({
      [ALLOWLIST_FEATURE_FLAGS.RESTRICTED_EVENT_CODES.key]: [
        'A',
        { privateField: 'not-allowed' },
      ],
    });

    expect(dto.isValid()).toBe(false);
    expect(dto.getValidationErrors()).toEqual(
      expect.objectContaining({
        [ALLOWLIST_FEATURE_FLAGS.RESTRICTED_EVENT_CODES.key]:
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
