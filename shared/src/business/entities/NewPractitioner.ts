import { ExcludeMethods } from 'types/TEntity';
import { JoiValidationConstants } from './JoiValidationConstants';
import { Practitioner } from './Practitioner';
import joi from 'joi';

export class NewPractitioner extends Practitioner {
  public barNumber?: string;
  public userId?: string;
  public name?: string;

  constructor(rawUser, options?) {
    super(rawUser, options);

    this.entityName = Practitioner.ENTITY_NAME;
  }

  static VALIDATION_RULES = {
    ...super.VALIDATION_RULES,
    barNumber: JoiValidationConstants.STRING.optional().allow(null),
    confirmEmail: JoiValidationConstants.EMAIL.when('email', {
      is: joi.exist().not(null),
      otherwise: joi.optional().allow(null),
      then: joi.valid(joi.ref('email')).required(),
    }).messages({
      'any.only': 'Email addresses do not match',
      'any.required': 'Enter a valid email address',
      'string.email': 'Enter a valid email address',
    }),
    email: JoiValidationConstants.EMAIL.required().messages({
      '*': 'Enter email address',
    }),
    firstName: JoiValidationConstants.STRING.max(100)
      .required()
      .description('The first name of the practitioner.')
      .messages({
        '*': 'Enter first name',
      }),
    lastName: JoiValidationConstants.STRING.max(100)
      .required()
      .description('The last name of the practitioner.')
      .messages({
        '*': 'Enter last name',
      }),
    role: JoiValidationConstants.STRING.optional().allow(null),
    updatedEmail: JoiValidationConstants.STRING.optional().allow(null),
    userId: JoiValidationConstants.STRING.optional().allow(null),
  };

  getValidationRules() {
    return NewPractitioner.VALIDATION_RULES;
  }
}

export type RawNewPractitioner = ExcludeMethods<NewPractitioner>;
