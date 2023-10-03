import { JoiValidationConstants } from './JoiValidationConstants';
import { JoiValidationEntity } from './JoiValidationEntity';
import { setDefaultErrorMessages } from '@shared/business/entities/utilities/setDefaultErrorMessages';
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

  static VALIDATION_ERROR_MESSAGES = {
    confirmEmail: [
      {
        contains: 'must be [ref:email]',
        message: 'Email addresses do not match',
      },
      { contains: 'is required', message: 'Enter a valid email address' },
      { contains: 'must be a valid', message: 'Enter a valid email address' },
    ],
    email: 'Enter a valid email address',
  };

  getValidationRules() {
    return {
      confirmEmail: JoiValidationConstants.EMAIL.valid(
        joi.ref('email'),
      ).required(),
      email: JoiValidationConstants.EMAIL.required(),
    };
  }

  getValidationRules_NEW() {
    return {
      confirmEmail: JoiValidationConstants.EMAIL.valid(joi.ref('email'))
        .required()
        .messages({
          'any.only': 'Email addresses do not match',
          'any.required': 'Enter a valid email address',
          'string.email': 'Enter a valid email address',
        }),
      email: JoiValidationConstants.EMAIL.required().messages(
        setDefaultErrorMessages('Enter a valid email address'),
      ),
    };
  }

  getErrorToMessageMap() {
    return UpdateUserEmail.VALIDATION_ERROR_MESSAGES;
  }
}
