import { JoiValidationConstants } from './JoiValidationConstants';
import { JoiValidationEntity } from './JoiValidationEntity';
import { getDefaultPasswordErrors } from '@shared/business/entities/NewPetitionerUser';
import joi from 'joi';

export class ChangePasswordForm extends JoiValidationEntity {
  public userEmail: string;
  public password: string;
  public confirmPassword: string;

  constructor(rawProps) {
    super('ChangePasswordForm');
    this.userEmail = rawProps.userEmail;
    this.password = rawProps.password;
    this.confirmPassword = rawProps.confirmPassword;
  }

  static VALIDATION_RULES = joi.object().keys({
    confirmPassword: joi
      .valid(joi.ref('password'))
      .required()
      .messages({ '*': 'Passwords must match' }),
    entityName:
      JoiValidationConstants.STRING.valid('ChangePasswordForm').required(),
    password: JoiValidationConstants.STRING.custom((value, helper) => {
      const errors = getDefaultPasswordErrors();

      if (value.length < 8 || value.length > 99) {
        errors.isProperLength.valid = false;
      }

      if (!/[a-z]/.test(value)) {
        errors.hasOneLowercase.valid = false;
      }

      if (!/[A-Z]/.test(value)) {
        errors.hasOneUppercase.valid = false;
      }

      if (!/[\^$*.[\]{}()?\-“!@#%&/,><’:;|_~`]/.test(value)) {
        errors.hasSpecialCharacterOrSpace.valid = false;
      }

      if (!/[0-9]/.test(value)) {
        errors.hasOneNumber.valid = false;
      }

      if (/^\s/.test(value) || /\s$/.test(value)) {
        errors.hasNoLeadingOrTrailingSpace.valid = false;
      }

      const noErrors = Object.values(errors).reduce(
        (accumulator, currentValue) => {
          return accumulator && currentValue.valid;
        },
        true,
      );

      if (noErrors) {
        return value;
      } else {
        return helper.message(
          Object.entries(errors)
            .filter(([, curValue]) => !curValue.valid)
            .map(([key]) => key)
            .join('|') as any,
        );
      }
    }).description(
      'Password for the account. Contains a custom validation because we want to construct a string with all the keys that failed which later we parse out to an object',
    ),
    userEmail: JoiValidationConstants.EMAIL.required()
      .messages({
        '*': 'Enter a valid email address',
        'string.max': 'Email address must contain fewer than 100 characters',
      })
      .description('Email of user'),
  });

  getValidationRules() {
    return ChangePasswordForm.VALIDATION_RULES;
  }
}

export type RawChangePasswordForm = ExcludeMethods<ChangePasswordForm>;
