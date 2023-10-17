import { JoiValidationConstants } from './JoiValidationConstants';
import { Practitioner } from './Practitioner';
import { setDefaultErrorMessage } from '@shared/business/entities/utilities/setDefaultErrorMessage';
import joi from 'joi';

export class NewPractitioner extends Practitioner {
  constructor(rawUser, options?) {
    super(rawUser, options);
    this.entityName = 'Practitioner';
  }

  getValidationRules() {
    const superSchema = super.getValidationRules();
    return {
      ...superSchema,
      barNumber: JoiValidationConstants.STRING.optional()
        .allow(null)
        .messages(setDefaultErrorMessage('Bar number is required')),
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
        setDefaultErrorMessage('Enter email address'),
      ),
      firstName: superSchema.firstName.messages(
        setDefaultErrorMessage('Enter first name'),
      ),
      lastName: superSchema.lastName.messages(
        setDefaultErrorMessage('Enter last name'),
      ),
      role: JoiValidationConstants.STRING.optional().allow(null),
      updatedEmail: JoiValidationConstants.STRING.optional()
        .allow(null)
        .messages(setDefaultErrorMessage('Enter a valid email address')),
      userId: JoiValidationConstants.STRING.optional().allow(null),
    };
  }
}
