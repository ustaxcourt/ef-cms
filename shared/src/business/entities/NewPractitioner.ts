import { JoiValidationConstants } from './JoiValidationConstants';
import { Practitioner } from './Practitioner';
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

  getErrorToMessageMap() {
    return NewPractitioner.VALIDATION_ERROR_MESSAGES;
  }
}
