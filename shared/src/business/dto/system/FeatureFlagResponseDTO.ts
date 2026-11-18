import {
  ALLOWLIST_FEATURE_FLAGS,
  type FeatureFlagKeys,
} from '@shared/business/entities/EntityConstants';
import { JoiValidationEntity } from '@shared/business/entities/JoiValidationEntity';
import joi from 'joi';

type FeatureFlagResponseValueByKey = {
  [ALLOWLIST_FEATURE_FLAGS.AWS_BATCH_ZIPPER_MINIMUM_COUNT.key]: number | false;
  [ALLOWLIST_FEATURE_FLAGS.CHIEF_JUDGE_NAME.key]: string | false;
  [ALLOWLIST_FEATURE_FLAGS.DOCUMENT_VISIBILITY_POLICY_CHANGE_DATE.key]:
    string | false;
  [ALLOWLIST_FEATURE_FLAGS.E_CONSENT_FIELDS_ENABLED_FEATURE_FLAG.key]: boolean;
  [ALLOWLIST_FEATURE_FLAGS.ENABLE_PAYMENT_PORTAL_INTEGRATION.key]: boolean;
  [ALLOWLIST_FEATURE_FLAGS.NEW_TRIAL_CITIES.key]: boolean;
  [ALLOWLIST_FEATURE_FLAGS.RESTRICTED_EVENT_CODES.key]:
    string | string[] | false;
  [ALLOWLIST_FEATURE_FLAGS.USE_CHANGE_OF_ADDRESS_LAMBDA.key]: boolean;
  [ALLOWLIST_FEATURE_FLAGS.ALLOW_IDP_LOGIN.key]: boolean;
};

export type FeatureFlagValue = FeatureFlagResponseValueByKey[FeatureFlagKeys];

export type FeatureFlagResponseData = Partial<{
  [Key in FeatureFlagKeys]: FeatureFlagResponseValueByKey[Key];
}>;

export interface FeatureFlagResponseDTO extends FeatureFlagResponseData {
  entityName?: string;
}

const DISABLED_FEATURE_FLAG_VALUE_SCHEMA = joi.boolean().valid(false).strict();

const FEATURE_FLAG_VALUE_TYPE_ERROR_MESSAGE =
  '{{#label}} has an invalid feature flag value type';

const STRING_OR_DISABLED_FEATURE_FLAG_VALUE_SCHEMA = joi
  .alternatives()
  .try(joi.string().allow('').strict(), DISABLED_FEATURE_FLAG_VALUE_SCHEMA)
  .messages({
    'alternatives.match': FEATURE_FLAG_VALUE_TYPE_ERROR_MESSAGE,
  });

const FEATURE_FLAG_RESPONSE_DTO_VALIDATION_RULES = {
  [ALLOWLIST_FEATURE_FLAGS.AWS_BATCH_ZIPPER_MINIMUM_COUNT.key]: joi
    .alternatives()
    .try(joi.number().integer().strict(), DISABLED_FEATURE_FLAG_VALUE_SCHEMA)
    .messages({
      'alternatives.match': FEATURE_FLAG_VALUE_TYPE_ERROR_MESSAGE,
    }),
  [ALLOWLIST_FEATURE_FLAGS.CHIEF_JUDGE_NAME.key]:
    STRING_OR_DISABLED_FEATURE_FLAG_VALUE_SCHEMA,
  [ALLOWLIST_FEATURE_FLAGS.DOCUMENT_VISIBILITY_POLICY_CHANGE_DATE.key]:
    STRING_OR_DISABLED_FEATURE_FLAG_VALUE_SCHEMA,
  [ALLOWLIST_FEATURE_FLAGS.E_CONSENT_FIELDS_ENABLED_FEATURE_FLAG.key]: joi
    .boolean()
    .strict(),
  [ALLOWLIST_FEATURE_FLAGS.ENABLE_PAYMENT_PORTAL_INTEGRATION.key]: joi
    .boolean()
    .strict(),
  [ALLOWLIST_FEATURE_FLAGS.NEW_TRIAL_CITIES.key]: joi.boolean().strict(),
  [ALLOWLIST_FEATURE_FLAGS.RESTRICTED_EVENT_CODES.key]: joi
    .alternatives()
    .try(
      joi.string().allow('').strict(),
      joi.array().items(joi.string().strict()).strict(),
      DISABLED_FEATURE_FLAG_VALUE_SCHEMA,
    )
    .messages({
      'alternatives.match': FEATURE_FLAG_VALUE_TYPE_ERROR_MESSAGE,
    }),
  [ALLOWLIST_FEATURE_FLAGS.USE_CHANGE_OF_ADDRESS_LAMBDA.key]: joi
    .boolean()
    .strict(),
  [ALLOWLIST_FEATURE_FLAGS.ALLOW_IDP_LOGIN.key]: joi.boolean().strict(),
  entityName: joi.string().optional(),
};

export class FeatureFlagResponseDTO
  extends JoiValidationEntity
  implements FeatureFlagResponseData
{
  constructor(data: Record<string, unknown> = {}) {
    super('FeatureFlagResponseDTO');
    Object.assign(this, data);
  }

  static VALIDATION_RULES = joi
    .object(FEATURE_FLAG_RESPONSE_DTO_VALIDATION_RULES)
    .pattern(joi.string(), joi.forbidden());

  getValidationRules(): typeof FeatureFlagResponseDTO.VALIDATION_RULES {
    return FeatureFlagResponseDTO.VALIDATION_RULES;
  }
}
