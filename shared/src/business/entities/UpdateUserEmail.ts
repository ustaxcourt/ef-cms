import { JoiValidationConstants } from './JoiValidationConstants';
import { JoiValidationEntity_New } from './joiValidationEntity/JoiValidationEntity_New';
import joi from 'joi';

/**
 * constructor
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {object} providers.rawUpdateUserEmail the raw UpdateUserEmail data
 * @constructor
 */
export class UpdateUserEmail extends JoiValidationEntity_New {
  public email: string;
  public confirmEmail: string;

  constructor(rawUpdateUserEmail) {
    super('UpdateUserEmail');
    this.email = rawUpdateUserEmail.email;
    this.confirmEmail = rawUpdateUserEmail.confirmEmail;
  }

  static VALIDATION_RULES = {
    confirmEmail: JoiValidationConstants.EMAIL.valid(joi.ref('email'))
      .required()
      .messages({
        'any.only': 'Email addresses do not match',
        'any.required': 'Enter a valid email address',
        'string.email': 'Enter a valid email address',
      }),
    email: JoiValidationConstants.EMAIL.required().messages({
      '*': 'Enter a valid email address',
    }),
  };

  getValidationRules() {
    return UpdateUserEmail.VALIDATION_RULES;
  }
}
