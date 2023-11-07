import { JoiValidationConstants } from './JoiValidationConstants';
import { JoiValidationEntity } from './JoiValidationEntity';
import { TValidationError } from '@shared/business/entities/joiValidationEntity/helper';
import joi from 'joi';

interface PasswordValidation {
  message: string;
  valid: boolean;
}

type TValidationErrorPlusPasswordValidations = {
  [key: string]:
    | string
    | TValidationError
    | TValidationError[]
    | NewPetitionerUserPasswordValidations;
};

export type NewPetitionerUserPasswordValidations = {
  hasNoLeadingOrTrailingSpace: PasswordValidation;
  hasOneLowercase: PasswordValidation;
  hasOneNumber: PasswordValidation;
  hasOneUppercase: PasswordValidation;
  hasSpecialCharacterOrSpace: PasswordValidation;
  isProperLength: PasswordValidation;
};
export const NewPetitionerUserPasswordValidationErrorMessages = {
  hasNoLeadingOrTrailingSpace: 'Must not contain leading or trailing space',
  hasOneLowercase: 'Must contain lower case letter',
  hasOneNumber: 'Must contain number',
  hasOneUppercase: 'Must contain upper case letter',
  hasSpecialCharacterOrSpace: 'Must contain special character or space',
  isProperLength: 'Must be between 8-99 characters long',
};

function getDefaultPasswordErrors(): NewPetitionerUserPasswordValidations {
  return {
    hasNoLeadingOrTrailingSpace: {
      message:
        NewPetitionerUserPasswordValidationErrorMessages.hasNoLeadingOrTrailingSpace,
      valid: true,
    },
    hasOneLowercase: {
      message: NewPetitionerUserPasswordValidationErrorMessages.hasOneLowercase,
      valid: true,
    },
    hasOneNumber: {
      message: NewPetitionerUserPasswordValidationErrorMessages.hasOneNumber,
      valid: true,
    },
    hasOneUppercase: {
      message: NewPetitionerUserPasswordValidationErrorMessages.hasOneUppercase,
      valid: true,
    },
    hasSpecialCharacterOrSpace: {
      message:
        NewPetitionerUserPasswordValidationErrorMessages.hasSpecialCharacterOrSpace,
      valid: true,
    },
    isProperLength: {
      message: NewPetitionerUserPasswordValidationErrorMessages.isProperLength,
      valid: true,
    },
  };
}

export class NewPetitionerUser extends JoiValidationEntity {
  public email: string;
  public name: string;
  public password: string;
  public confirmPassword: string;

  constructor(rawProps) {
    super('NewPetitionerUser');

    this.email = rawProps.email ? rawProps.email?.toLowerCase() : '';
    this.name = rawProps.name;
    this.password = rawProps.password;
    this.confirmPassword = rawProps.confirmPassword;
  }

  static VALIDATION_RULES = joi.object().keys({
    confirmPassword: joi.valid(joi.ref('password')).required(),
    email: JoiValidationConstants.EMAIL.lowercase()
      .required()
      .messages({
        '*': 'Enter a valid email address',
        'string.max': 'Email address must contain fewer than 100 characters', //todo test
      })
      .description('Email of user'),
    entityName:
      JoiValidationConstants.STRING.valid('NewPetitionerUser').required(),
    name: JoiValidationConstants.STRING.max(100)
      .required()
      .messages({
        '*': 'Enter a name',
        'string.max': 'Enter a name with fewer than 100 characters',
      })
      .description('Name of the user.'),
    password: JoiValidationConstants.STRING.custom((value, helper) => {
      const passwordValidations = getDefaultPasswordErrors();

      if (value.length < 8 || value.length > 99) {
        passwordValidations.isProperLength.valid = false;
      }

      if (!/[a-z]/.test(value)) {
        passwordValidations.hasOneLowercase.valid = false;
      }

      if (!/[A-Z]/.test(value)) {
        passwordValidations.hasOneUppercase.valid = false;
      }

      if (!/[\^$*.[\]{}()?\-“!@#%&/,><’:;|_~`]/.test(value)) {
        passwordValidations.hasSpecialCharacterOrSpace.valid = false;
      }

      if (!/[0-9]/.test(value)) {
        passwordValidations.hasOneNumber.valid = false;
      }

      if (/^\s/.test(value) || /\s$/.test(value)) {
        passwordValidations.hasNoLeadingOrTrailingSpace.valid = false;
      }

      const noErrors = Object.values(passwordValidations).reduce(
        (accumulator, currentValue) => {
          return accumulator && currentValue.valid;
        },
        true,
      );

      if (noErrors) {
        return value;
      } else {
        return helper.error('custom.invalid', {
          message: '',
          passwordValidations,
        });
      }
    }).description(
      'Password for the account. Contains a custom validation because we want to construct a string with all the keys that failed which later we parse out to an object',
    ),
  });

  getValidationRules() {
    return NewPetitionerUser.VALIDATION_RULES;
  }

  getValidationErrors(): TValidationErrorPlusPasswordValidations {
    const schema = this.getValidationRules();

    const { error } = schema.validate(this, {
      abortEarly: false,
      allowUnknown: true,
    });

    const errors: TValidationErrorPlusPasswordValidations = {
      password: getDefaultPasswordErrors(),
    };
    error?.details.forEach(detail => {
      if (!detail.context) return;
      if (!Number.isInteger(detail.context.key)) {
        const KEY = detail.context.key || detail.type;
        if (KEY === 'password') {
          errors[KEY] = detail.context.passwordValidations;
        } else {
          errors[KEY] = detail.message;
        }
      } else {
        errors[detail.context.label!] = detail.message;
      }
    });

    return errors;
  }

  getErrorToMessageMap() {
    return {};
  }

  isValid(): boolean {
    const errors = this.getFormattedValidationErrors() as {
      [key: string]: string | NewPetitionerUserPasswordValidations;
    };
    return this.isFormValid(errors);
  }

  isFormValid(errors: TValidationErrorPlusPasswordValidations): boolean {
    const keys = Object.keys(errors);
    if (keys.length > 1) return false;
    if (keys[0] !== 'password') return false;

    return Object.values(errors.password).reduce(
      (accumulator, currentValue) => {
        return accumulator && currentValue.valid;
      },
      true,
    );
  }
}

export type RawNewPetitionerUser = ExcludeMethods<NewPetitionerUser>;
