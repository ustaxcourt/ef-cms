import { JoiValidationConstants } from './JoiValidationConstants';
import { JoiValidationEntity } from './JoiValidationEntity';
import joi from 'joi';

export type CreateAccountFormPasswordValidations = {
  hasNoLeadingOrTrailingSpace: boolean;
  hasOneLowercase: boolean;
  hasOneNumber: boolean;
  hasOneUppercase: boolean;
  hasSpecialCharacterOrSpace: boolean;
  isProperLength: boolean;
};

function getDefaultErrors(): CreateAccountFormPasswordValidations {
  return {
    hasNoLeadingOrTrailingSpace: true,
    hasOneLowercase: true,
    hasOneNumber: true,
    hasOneUppercase: true,
    hasSpecialCharacterOrSpace: true,
    isProperLength: true,
  };
}

export class CreateAccountForm extends JoiValidationEntity {
  public email: string;
  public name: string;
  public password: string;
  public confirmPassword: string;

  constructor(rawProps) {
    super('CreateAccountForm');

    this.email = rawProps.email;
    this.name = rawProps.name;
    this.password = rawProps.password;
    this.confirmPassword = rawProps.confirmPassword;
  }

  static VALIDATION_RULES = joi.object().keys({
    confirmPassword: joi.valid(joi.ref('password')).required(),
    email: JoiValidationConstants.EMAIL.required().description('Email of user'),
    entityName:
      JoiValidationConstants.STRING.valid('CreateAccountForm').required(),
    name: JoiValidationConstants.STRING.max(100)
      .required()
      .description('Name of the user.'),
    password: JoiValidationConstants.STRING.custom((value, helper) => {
      const errors = getDefaultErrors();

      if (value.length < 8 || value.length > 99) {
        errors.isProperLength = false;
      }

      if (!/[a-z]/.test(value)) {
        errors.hasOneLowercase = false;
      }

      if (!/[A-Z]/.test(value)) {
        errors.hasOneUppercase = false;
      }

      if (!/[\^$*.[\]{}()?\-“!@#%&/,><’:;|_~`]/.test(value)) {
        errors.hasSpecialCharacterOrSpace = false;
      }

      if (!/[0-9]/.test(value)) {
        errors.hasOneNumber = false;
      }

      if (/^\s/.test(value) || /\s$/.test(value)) {
        errors.hasNoLeadingOrTrailingSpace = false;
      }

      if (Object.values(errors).every(Boolean)) {
        return value;
      } else {
        return helper.message(
          Object.entries(errors)
            .filter(([, curValue]) => !curValue)
            .map(([key]) => key)
            .join('|') as any,
        );
      }
    }).description(
      'Password for the account. Contains a custom validation because we want to construct a string with all the keys that failed which later we parse out to an object',
    ),
  });

  getValidationRules() {
    return CreateAccountForm.VALIDATION_RULES;
  }

  // @ts-ignore
  getFormattedValidationErrors(): {
    [key: string]: string | CreateAccountFormPasswordValidations;
  } {
    const results: {
      [key: string]: string | CreateAccountFormPasswordValidations;
    } | null = super.getFormattedValidationErrors();

    if (!results) return { password: getDefaultErrors() };
    if (!results.password || typeof results.password !== 'string')
      return {
        ...results,
        password: getDefaultErrors(),
      };

    const errors = results.password.split('|');
    const errorsToReturn = getDefaultErrors();

    for (let error of errors) {
      errorsToReturn[error] = false;
    }
    results.password = errorsToReturn;

    return results;
  }

  getErrorToMessageMap() {
    return {
      email: 'Enter a valid email address',
      name: [
        {
          contains: 'must be less than or equal to',
          message: 'Enter a name with less than 100 characters',
        },
        'Enter a name',
      ],
    };
  }

  isFormValid(errors: {
    [key: string]: string | CreateAccountFormPasswordValidations;
  }): boolean {
    const keys = Object.keys(errors);
    if (keys.length > 1) return false;
    if (keys[0] !== 'password') return false;

    return Object.values(errors.password).every(Boolean);
  }
}

export type RawCreateAccountForm = ExcludeMethods<CreateAccountForm>;
