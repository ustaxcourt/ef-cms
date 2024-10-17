import { JoiValidationConstants } from './JoiValidationConstants';
import { JoiValidationEntity } from '@shared/business/entities/JoiValidationEntity';
import joi from 'joi';

export class EmailConfirmationForm extends JoiValidationEntity {
  public confirmEmail: string;
  public email: string;

  constructor(rawEmail: { email: string; confirmEmail: string }) {
    super('EmailForm');

    this.email = rawEmail.email;
    this.confirmEmail = rawEmail.confirmEmail;
  }

  static VALIDATION_RULES = joi.object({
    confirmEmail: joi
      .when('email', {
        is: JoiValidationConstants.EMAIL,
        otherwise: JoiValidationConstants.EMAIL.required(),
        then: joi.valid(joi.ref('email')).required(),
      })
      .messages({
        'any.only': 'Email addresses do not match',
        'any.required': 'Enter a valid email address',
        'string.email': 'Enter email address in format: yourname@example.com',
      }),
    email: JoiValidationConstants.EMAIL.required().messages({
      'any.required': 'Enter a valid email address',
      'string.email': 'Enter email address in format: yourname@example.com',
    }),
  });

  getValidationRules() {
    return EmailConfirmationForm.VALIDATION_RULES;
  }
}

export type RawEmailConfirmationForm = ExcludeMethods<EmailConfirmationForm>;
