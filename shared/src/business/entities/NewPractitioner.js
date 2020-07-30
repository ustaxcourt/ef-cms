const joi = require('joi');
const {
  joiValidationDecorator,
} = require('../../utilities/JoiValidationDecorator');
const { Practitioner } = require('./Practitioner');

/**
 * constructor
 *
 * @param {object} rawUser the raw user data
 * @constructor
 */
function NewPractitioner(rawUser) {
  Practitioner.prototype.init.call(this, rawUser);
  this.firstName = rawUser.firstName;
  this.lastName = rawUser.lastName;
}

const VALIDATION_ERROR_MESSAGES = {
  ...Practitioner.VALIDATION_ERROR_MESSAGES,
  email: 'Enter email',
  firstName: 'Enter first name',
  lastName: 'Enter last name',
};

joiValidationDecorator(
  NewPractitioner,
  joi.object().keys({
    ...Practitioner.validationRules,
    admissionsStatus: joi.string().required(),
    barNumber: joi.string().optional().allow(null),
    email: joi.string().required(),
    firstName: joi.string().required(),
    lastName: joi.string().required(),
    role: joi.string().optional().allow(null),
    userId: joi.string().optional().allow(null),
  }),
  VALIDATION_ERROR_MESSAGES,
);

NewPractitioner.validationName = 'Practitioner';

module.exports = { NewPractitioner };
