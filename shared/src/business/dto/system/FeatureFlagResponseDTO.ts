import { ALLOWLIST_FEATURE_FLAGS } from '@shared/business/entities/EntityConstants';
import { JoiValidationEntity } from '@shared/business/entities/JoiValidationEntity';
import joi from 'joi';

const FEATURE_FLAG_VALUE_SCHEMA = joi
  .alternatives()
  .try(joi.string(), joi.boolean(), joi.number().integer(), joi.array())
  .optional();

const ALLOWLIST_FEATURE_FLAG_VALIDATION_RULES = Object.fromEntries(
  Object.values(ALLOWLIST_FEATURE_FLAGS).map(featureFlag => [
    featureFlag.key,
    FEATURE_FLAG_VALUE_SCHEMA,
  ]),
);

const FEATURE_FLAG_RESPONSE_DTO_VALIDATION_RULES = {
  ...ALLOWLIST_FEATURE_FLAG_VALIDATION_RULES,
  entityName: joi.string().optional(),
};

export class FeatureFlagResponseDTO extends JoiValidationEntity {
  constructor(data: Record<string, unknown> = {}) {
    super('FeatureFlagResponseDTO');
    Object.assign(this, data);
  }

  static VALIDATION_RULES = joi
    .object(FEATURE_FLAG_RESPONSE_DTO_VALIDATION_RULES)
    .pattern(joi.string(), joi.forbidden());

  getValidationRules() {
    return FeatureFlagResponseDTO.VALIDATION_RULES;
  }
}
