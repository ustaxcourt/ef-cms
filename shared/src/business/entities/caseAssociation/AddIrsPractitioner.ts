import { JoiValidationConstants } from '../JoiValidationConstants';
import { JoiValidationEntity } from '@shared/business/entities/JoiValidationEntity';
import { SERVICE_INDICATOR_TYPES } from '../EntityConstants';
import joi from 'joi';

export class AddIrsPractitioner extends JoiValidationEntity {
  public email?: string;
  public serviceIndicator: string;
  public user: any;

  constructor(rawProps: any) {
    super('AddIrsPractitioner');

    this.email = rawProps.user?.email;
    this.serviceIndicator = rawProps.serviceIndicator;
    this.user = rawProps.user;
  }

  static VALIDATION_RULES = {
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
        '*': 'Select service type',
        'any.only':
          'No email found for electronic service. Select a valid service preference.',
      }),
    user: joi.object().required().messages({
      '*': 'Select a respondent counsel',
    }),
  };

  getValidationRules() {
    return AddIrsPractitioner.VALIDATION_RULES;
  }
}

export type RawAddIrsPractitioner = ExcludeMethods<AddIrsPractitioner>;
