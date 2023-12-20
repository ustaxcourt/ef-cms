import { ExcludeMethods } from 'types/TEntity';
import { JoiValidationConstants } from './JoiValidationConstants';
import { JoiValidationEntity } from './JoiValidationEntity';
import joi from 'joi';

type PasswordValidation = {
  message: string;
  valid: boolean;
};

export type NewPetitionerUserPasswordValidations = {
  hasNoLeadingOrTrailingSpace: PasswordValidation;
  hasOneLowercase: PasswordValidation;
  hasOneNumber: PasswordValidation;
  hasOneUppercase: PasswordValidation;
  hasSpecialCharacterOrSpace: PasswordValidation;
  isProperLength: PasswordValidation;
};
const NewPetitionerUserPasswordValidationErrorMessages = {
  hasNoLeadingOrTrailingSpace: 'Must not contain leading or trailing space',
  hasOneLowercase: 'Must contain lower case letter',
  hasOneNumber: 'Must contain number',
  hasOneUppercase: 'Must contain upper case letter',
  hasSpecialCharacterOrSpace: 'Must contain special character or space',
  isProperLength: 'Must be between 8-99 characters long',
};

export function getDefaultPasswordErrors(): NewPetitionerUserPasswordValidations {
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

    this.email = rawProps.email;
    this.name = rawProps.name;
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
  });

  getValidationRules() {
    return NewPetitionerUser.VALIDATION_RULES;
  }
}

export type RawNewPetitionerUser = ExcludeMethods<NewPetitionerUser>;
