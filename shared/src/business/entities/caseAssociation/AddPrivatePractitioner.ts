import { JoiValidationConstants } from '../JoiValidationConstants';
import { JoiValidationEntity } from '../JoiValidationEntity';
import { SERVICE_INDICATOR_TYPES } from '../EntityConstants';
import joi from 'joi';

export class AddPrivatePractitioner extends JoiValidationEntity {
  public email?: string;
  public representing: string[];
  public serviceIndicator: string;
  public user: Record<string, any>;

  constructor(rawProps) {
    super('AddPrivatePractitioner');
    this.email = rawProps.user?.email;
    this.representing = rawProps.representing;
    this.serviceIndicator = rawProps.serviceIndicator;
    this.user = rawProps.user;
  }

  static VALIDATION_RULES = {
    email: JoiValidationConstants.STRING.optional(),
    representing: joi
      .array()
      .items(JoiValidationConstants.UUID.required())
      .required(),
    serviceIndicator: joi
      .when('email', {
        is: joi.exist().not(null),
        otherwise: JoiValidationConstants.STRING.valid(
          SERVICE_INDICATOR_TYPES.SI_NONE,
          SERVICE_INDICATOR_TYPES.SI_PAPER,
        ),
        then: JoiValidationConstants.STRING.valid(
          ...Object.values(SERVICE_INDICATOR_TYPES),
        ),
      })
      .required(),
    user: joi.object().required(),
  } as const;

  static VALIDATION_ERROR_MESSAGES = {
    representing: 'Select a represented party',
    serviceIndicator: [
      {
        contains: 'must be one of',
        message:
          'No email found for electronic service. Select a valid service preference.',
      },
      'Select service type',
    ],
    user: 'Select a petitioner counsel',
  } as const;

  getValidationRules() {
    return AddPrivatePractitioner.VALIDATION_RULES;
  }

  getErrorToMessageMap() {
    return AddPrivatePractitioner.VALIDATION_ERROR_MESSAGES;
  }
}

export type RawAddPrivatePractitioner = ExcludeMethods<AddPrivatePractitioner>;
