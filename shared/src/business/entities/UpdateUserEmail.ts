import { JoiValidationConstants } from './JoiValidationConstants';
import { JoiValidationEntity } from './JoiValidationEntity';
import { setDefaultErrorMessage } from '@shared/business/entities/utilities/setDefaultErrorMessage';
import joi from 'joi';

/**
 * constructor
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {object} providers.rawUpdateUserEmail the raw UpdateUserEmail data
 * @constructor
 */
export class UpdateUserEmail extends JoiValidationEntity {
  public email: string;
  public confirmEmail: string;

  constructor(rawUpdateUserEmail) {
    super('UpdateUserEmail');
    this.email = rawUpdateUserEmail.email;
    this.confirmEmail = rawUpdateUserEmail.confirmEmail;
  }

  getValidationRules() {
    return {
      confirmEmail: JoiValidationConstants.EMAIL.valid(joi.ref('email'))
        .required()
        .messages({
          'any.only': 'Email addresses do not match',
          'any.required': 'Enter a valid email address',
          'string.email': 'Enter a valid email address',
        }),
      email: JoiValidationConstants.EMAIL.required().messages(
        setDefaultErrorMessage('Enter a valid email address'),
      ),
    };
  }
}
