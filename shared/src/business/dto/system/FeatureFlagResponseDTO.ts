import { ALLOWLIST_FEATURE_FLAGS } from '@shared/business/entities/EntityConstants';
import { JoiValidationEntity } from '@shared/business/entities/JoiValidationEntity';
import joi from 'joi';

type AllowedFeatureFlagKeys =
  (typeof ALLOWLIST_FEATURE_FLAGS)[keyof typeof ALLOWLIST_FEATURE_FLAGS]['key'];

export class FeatureFlagResponseDTO extends JoiValidationEntity {
  constructor(data: Partial<Record<AllowedFeatureFlagKeys, any>> = {}) {
    super('FeatureFlagResponseDTO');
    Object.assign(this, data);
  }

  static VALIDATION_RULES = joi
    .object()
    .pattern(
      joi.string(),
      joi
        .alternatives()
        .try(joi.string(), joi.boolean(), joi.number().integer(), joi.array())
        .optional(),
    );

  getValidationRules() {
    return FeatureFlagResponseDTO.VALIDATION_RULES;
  }
}
