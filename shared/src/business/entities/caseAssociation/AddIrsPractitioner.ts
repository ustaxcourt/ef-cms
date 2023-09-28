import { JoiValidationConstants } from '../JoiValidationConstants';
import { JoiValidationEntity } from '../JoiValidationEntity';
import { SERVICE_INDICATOR_TYPES } from '../EntityConstants';
import joi from 'joi';

export class AddIrsPractitioner extends JoiValidationEntity {
  public email: string;
  public serviceIndicator: string;
  public user: any;

  constructor(rawProps: any) {
    super('AddIrsPractitioner');
    this.email = rawProps.user?.email;
    this.serviceIndicator = rawProps.serviceIndicator;
    this.user = rawProps.user;
  }

  static VALIDATION_ERROR_MESSAGES = {
    serviceIndicator: [
      {
        contains: 'must be one of',
        message:
          'No email found for electronic service. Select a valid service preference.',
      },
      'Select service type',
    ],
    user: 'Select a respondent counsel',
  } as const;

  getErrorToMessageMap() {
    return AddIrsPractitioner.VALIDATION_ERROR_MESSAGES;
  }

  getValidationRules() {
    return {
      email: JoiValidationConstants.STRING.optional(),
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
    };
  }

  getValidationRules_NEW() {
    return {
      email: JoiValidationConstants.STRING.optional(),
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
        .required()
        .messages({
          'any.only':
            'No email found for electronic service. Select a valid service preference.',
          'any.required': 'Select service type',
        }),
      user: joi.object().required().messages({
        'any.required': 'Select a respondent counsel',
      }),
    };
  }
}

declare global {
  type RawAddIrsPractitioner = ExcludeMethods<AddIrsPractitioner>;
}
