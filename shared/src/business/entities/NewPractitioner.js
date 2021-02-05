const joi = require('joi');
const {
  JoiValidationConstants,
} = require('../../utilities/JoiValidationConstants');
const {
  joiValidationDecorator,
  validEntityDecorator,
} = require('../../utilities/JoiValidationDecorator');
const { Practitioner } = require('./Practitioner');

/**
 * constructor
 *
 * @param {object} rawUser the raw user data
 * @constructor
 */
function NewPractitioner() {
  this.entityName = 'Practitioner';
}

NewPractitioner.prototype.init = function init(rawUser) {
  Practitioner.prototype.init.call(this, rawUser);
  this.firstName = rawUser.firstName;
  this.lastName = rawUser.lastName;
  this.updatedEmail = rawUser.updatedEmail;
  this.confirmEmail = rawUser.confirmEmail;
};

NewPractitioner.validationName = 'Practitioner';

const VALIDATION_ERROR_MESSAGES = {
  ...Practitioner.VALIDATION_ERROR_MESSAGES,
  confirmEmail: [
    {
      contains: 'must be [ref:updatedEmail]',
      message: 'Email addresses do not match',
    },
    { contains: 'is required', message: 'Enter a valid email address' },
    { contains: 'must be a valid', message: 'Enter a valid email address' },
  ],
  email: 'Enter email address',
  firstName: 'Enter first name',
  lastName: 'Enter last name',
  updatedEmail: 'Enter a valid email address',
};

joiValidationDecorator(
  NewPractitioner,
  joi.object().keys({
    ...Practitioner.validationRules,
    admissionsStatus: JoiValidationConstants.STRING.required(),
    barNumber: JoiValidationConstants.STRING.optional().allow(null),
    confirmEmail: JoiValidationConstants.EMAIL.when('updatedEmail', {
      is: joi.exist().not(null),
      otherwise: joi.optional().allow(null),
      then: joi.valid(joi.ref('updatedEmail')).required(),
    }),
    email: JoiValidationConstants.STRING.required(),
    firstName: JoiValidationConstants.STRING.required(),
    lastName: JoiValidationConstants.STRING.required(),
    role: JoiValidationConstants.STRING.optional().allow(null),
    updatedEmail: JoiValidationConstants.EMAIL.optional().allow(null),
    userId: JoiValidationConstants.STRING.optional().allow(null),
  }),
  VALIDATION_ERROR_MESSAGES,
);

exports.NewPractitioner = validEntityDecorator(NewPractitioner);
