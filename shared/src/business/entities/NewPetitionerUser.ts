import { JoiValidationConstants } from './JoiValidationConstants';
import { JoiValidationEntity } from './JoiValidationEntity';
import joi from 'joi';

export type NewPetitionerUserPasswordValidations = {
  hasNoLeadingOrTrailingSpace: string;
  hasOneLowercase: string;
  hasOneNumber: string;
  hasOneUppercase: string;
  hasSpecialCharacterOrSpace: string;
  isProperLength: string;
};
const NewPetitionerUserPasswordValidationErrorMessages = {
  hasNoLeadingOrTrailingSpace: 'Must not contain leading or trailing space',
  hasOneLowercase: 'Must contain lower case letter',
  hasOneNumber: 'Must contain number',
  hasOneUppercase: 'Must contain upper case letter',
  hasSpecialCharacterOrSpace: 'Must contain special character or space',
  isProperLength: 'Must be between 8-99 characters long',
};

function getDefaultErrors(): NewPetitionerUserPasswordValidations {
  return {
    hasNoLeadingOrTrailingSpace: '',
    hasOneLowercase: '',
    hasOneNumber: '',
    hasOneUppercase: '',
    hasSpecialCharacterOrSpace: '',
    isProperLength: '',
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
      const errors = getDefaultErrors();

      if (value.length < 8 || value.length > 99) {
        errors.isProperLength =
          NewPetitionerUserPasswordValidationErrorMessages.isProperLength;
      }

      if (!/[a-z]/.test(value)) {
        errors.hasOneLowercase =
          NewPetitionerUserPasswordValidationErrorMessages.hasOneLowercase;
      }

      if (!/[A-Z]/.test(value)) {
        errors.hasOneUppercase =
          NewPetitionerUserPasswordValidationErrorMessages.hasOneUppercase;
      }

      if (!/[\^$*.[\]{}()?\-“!@#%&/,><’:;|_~`]/.test(value)) {
        errors.hasSpecialCharacterOrSpace =
          NewPetitionerUserPasswordValidationErrorMessages.hasSpecialCharacterOrSpace;
      }

      if (!/[0-9]/.test(value)) {
        errors.hasOneNumber =
          NewPetitionerUserPasswordValidationErrorMessages.hasOneNumber;
      }

      if (/^\s/.test(value) || /\s$/.test(value)) {
        errors.hasNoLeadingOrTrailingSpace =
          NewPetitionerUserPasswordValidationErrorMessages.hasNoLeadingOrTrailingSpace;
      }

      const noErrors = Object.values(errors).reduce(
        (accumulator, currentValue) => {
          return accumulator && !currentValue;
        },
        true,
      );

      if (noErrors) {
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
    return NewPetitionerUser.VALIDATION_RULES;
  }

  getLiveFormattedValidationErrors(): {
    [key: string]: string | NewPetitionerUserPasswordValidations;
  } {
    const results: {
      [key: string]: string | NewPetitionerUserPasswordValidations;
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
      errorsToReturn[error] =
        NewPetitionerUserPasswordValidationErrorMessages[error];
    }
    results.password = errorsToReturn;

    return results;
  }

  getErrorToMessageMap() {
    return {};
  }

  isValid(): boolean {
    const errors = this.getLiveFormattedValidationErrors();
    return this.isFormValid(errors);
  }

  isFormValid(errors: {
    [key: string]: string | NewPetitionerUserPasswordValidations;
  }): boolean {
    const keys = Object.keys(errors);
    if (keys.length > 1) return false;
    if (keys[0] !== 'password') return false;

    return !Object.values(errors.password).every(Boolean);
  }
}

export type RawNewPetitionerUser = ExcludeMethods<NewPetitionerUser>;
