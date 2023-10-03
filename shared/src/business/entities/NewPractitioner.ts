import { JoiValidationConstants } from './JoiValidationConstants';
import { Practitioner } from './Practitioner';
import { setDefaultErrorMessages } from '@shared/business/entities/utilities/setDefaultErrorMessages';
import joi from 'joi';

export class NewPractitioner extends Practitioner {
  constructor(rawUser, options?) {
    super(rawUser, options);
    this.entityName = 'Practitioner';
  }

  static VALIDATION_ERROR_MESSAGES = {
    ...Practitioner.VALIDATION_ERROR_MESSAGES,
    confirmEmail: [
      {
        contains: 'must be [ref:email]',
        message: 'Email addresses do not match',
      },
      { contains: 'is required', message: 'Enter a valid email address' },
      { contains: 'must be a valid', message: 'Enter a valid email address' },
    ],
    email: 'Enter email address',
    firstName: 'Enter first name',
    lastName: 'Enter last name',
  };

  getValidationRules() {
    return {
      ...super.getValidationRules(),
      barNumber: JoiValidationConstants.STRING.optional().allow(null),
      confirmEmail: JoiValidationConstants.EMAIL.when('email', {
        is: joi.exist().not(null),
        otherwise: joi.optional().allow(null),
        then: joi.valid(joi.ref('email')).required(),
      }),
      email: JoiValidationConstants.EMAIL.required(),
      role: JoiValidationConstants.STRING.optional().allow(null),
      updatedEmail: JoiValidationConstants.STRING.optional().allow(null),
      userId: JoiValidationConstants.STRING.optional().allow(null),
    };
  }

  getValidationRules_NEW() {
    const superSchema = super.getValidationRules_NEW();
    return {
      ...superSchema,
      barNumber: JoiValidationConstants.STRING.optional()
        .allow(null)
        .messages(setDefaultErrorMessages('Bar number is required')),
      confirmEmail: JoiValidationConstants.EMAIL.when('email', {
        is: joi.exist().not(null),
        otherwise: joi.optional().allow(null),
        then: joi.valid(joi.ref('email')).required(),
      }).messages({
        'any.only': 'Email addresses do not match',
        'any.required': 'Enter a valid email address',
        'string.email': 'Enter a valid email address',
      }),
      email: JoiValidationConstants.EMAIL.required().messages(
        setDefaultErrorMessages('Enter email address'),
      ),
      firstName: superSchema.firstName.messages(
        setDefaultErrorMessages('Enter first name'),
      ),
      lastName: superSchema.lastName.messages(
        setDefaultErrorMessages('Enter last name'),
      ),
      role: JoiValidationConstants.STRING.optional().allow(null),
      updatedEmail: JoiValidationConstants.STRING.optional()
        .allow(null)
        .messages(setDefaultErrorMessages('Enter a valid email address')),
      userId: JoiValidationConstants.STRING.optional().allow(null),
    };
  }

  getErrorToMessageMap() {
    return NewPractitioner.VALIDATION_ERROR_MESSAGES;
  }
}
