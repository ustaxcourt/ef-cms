import { JoiValidationConstants } from './JoiValidationConstants';
import { JoiValidationEntity } from './JoiValidationEntity';
import { PASSWORD_RULE } from '@shared/business/entities/EntityValidationConstants';
import joi from 'joi';

export class ChangePasswordForm extends JoiValidationEntity {
  public email: string;
  public password: string;
  public confirmPassword: string;

  constructor(rawProps) {
    super('ChangePasswordForm');

    this.email = rawProps.email;
    this.password = rawProps.password;
    this.confirmPassword = rawProps.confirmPassword;
  }

  static VALIDATION_RULES = joi.object().keys({
    confirmPassword: joi
      .valid(joi.ref('password'))
      .required()
      .messages({ '*': 'Passwords must match' }),
    email: JoiValidationConstants.EMAIL.required()
      .messages({
        '*': 'Enter a valid email address',
        'string.max': 'Email address must contain fewer than 100 characters',
      })
      .description('Email of user'),
    entityName:
      JoiValidationConstants.STRING.valid('ChangePasswordForm').required(),
    password: PASSWORD_RULE,
  });

  getValidationRules() {
    return ChangePasswordForm.VALIDATION_RULES;
  }
}

export type RawChangePasswordForm = ExcludeMethods<ChangePasswordForm>;
