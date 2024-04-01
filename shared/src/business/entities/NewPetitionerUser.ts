import { JoiValidationConstants } from './JoiValidationConstants';
import { JoiValidationEntity } from './JoiValidationEntity';
import { PASSWORD_RULE } from '@shared/business/entities/EntityValidationConstants';
import joi from 'joi';

export class NewPetitionerUser extends JoiValidationEntity {
  public email: string;
  public name: string;
  public password: string;
  public confirmPassword: string;

  constructor(rawProps) {
    super('NewPetitionerUser');

    this.email = rawProps.email ? rawProps.email.toLowerCase() : rawProps.email;
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
    password: PASSWORD_RULE,
  });

  getValidationRules() {
    return NewPetitionerUser.VALIDATION_RULES;
  }
}

export type RawNewPetitionerUser = ExcludeMethods<NewPetitionerUser>;
