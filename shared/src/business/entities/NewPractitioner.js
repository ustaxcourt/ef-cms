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
};

const VALIDATION_ERROR_MESSAGES = {
  ...Practitioner.VALIDATION_ERROR_MESSAGES,
  confirmEmail: [
    {
      contains: 'must be [ref:email]',
      message: 'Email addresses do not match',
    },
    { contains: 'is required', message: 'Enter a valid email address' },
    { contains: 'must be a valid', message: 'Enter a valid email address' },
  ],
  email: 'Enter email address',
  firstName: 'Enter first name',
  lastName: 'Enter last name',
};

NewPractitioner.VALIDATION_ERROR_MESSAGES = VALIDATION_ERROR_MESSAGES;

joiValidationDecorator(
  NewPractitioner,
  joi.object().keys({
    ...Practitioner.validationRules,
    barNumber: JoiValidationConstants.STRING.optional().allow(null),
    confirmEmail: JoiValidationConstants.EMAIL.when('email', {
      is: joi.exist().not(null),
      otherwise: joi.optional().allow(null),
      then: joi.valid(joi.ref('email')).required(),
    }),
    email: JoiValidationConstants.EMAIL.required(),
    role: JoiValidationConstants.STRING.optional().allow(null),
    updatedEmail: JoiValidationConstants.STRING.optional().allow(null),
    userId: JoiValidationConstants.STRING.optional().allow(null),
  }),
  VALIDATION_ERROR_MESSAGES,
);

exports.NewPractitioner = validEntityDecorator(NewPractitioner);
