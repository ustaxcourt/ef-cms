import { JoiValidationConstants } from '../JoiValidationConstants';
import { JoiValidationEntity } from '@shared/business/entities/JoiValidationEntity';
import { SERVICE_INDICATOR_TYPES } from '../EntityConstants';
import joi from 'joi';

export class AddPrivatePractitioner extends JoiValidationEntity {
  public email?: string;
  public representing: string[];
  public serviceIndicator: string;
  public user: Record<string, any>;

  constructor(rawProps) {
    super('AddPrivatePractitioner');

    this.email = rawProps.user?.email
      ? rawProps.user?.email.toLowerCase()
      : undefined;
    this.representing = rawProps.representing;
    this.serviceIndicator = rawProps.serviceIndicator;
    this.user = rawProps.user;
  }

  static VALIDATION_RULES = {
    email: JoiValidationConstants.STRING.optional(),
    representing: joi
      .array()
      .items(JoiValidationConstants.UUID.required())
      .required()
      .messages({ '*': 'Select a represented party' }),
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
    user: joi
      .object()
      .required()
      .messages({ '*': 'Select a petitioner counsel' }),
  } as const;

  getValidationRules() {
    return AddPrivatePractitioner.VALIDATION_RULES;
  }
}

export type RawAddPrivatePractitioner = ExcludeMethods<AddPrivatePractitioner>;
