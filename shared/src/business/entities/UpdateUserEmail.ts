import { JoiValidationConstants } from './JoiValidationConstants';
import { JoiValidationEntity } from '@shared/business/entities/JoiValidationEntity';
import joi from 'joi';

export class UpdateUserEmail extends JoiValidationEntity {
  public confirmEmail: string;
  public email: string;

  constructor(rawUpdateUserEmail: { email: string; confirmEmail: string }) {
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
        'string.email': 'Enter email address in format: yourname@example.com',
      }),
    email: JoiValidationConstants.EMAIL.required().messages({
      'any.required': 'Enter a valid email address',
      'string.email': 'Enter email address in format: yourname@example.com',
    }),
  };

  getValidationRules() {
    return UpdateUserEmail.VALIDATION_RULES;
  }
}

export type RawUpdateUserEmail = ExcludeMethods<UpdateUserEmail>;
