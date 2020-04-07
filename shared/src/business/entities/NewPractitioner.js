const joi = require('@hapi/joi');
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
    admissionsStatus: joi.string().optional().allow(null),
    barNumber: joi.string().optional().allow(null),
    email: joi.string().required(),
    firstName: joi.string().required(),
    isAdmitted: joi.string().optional().allow(null),
    lastName: joi.string().required(),
    userId: joi.string().optional().allow(null),
  }),
  undefined,
  VALIDATION_ERROR_MESSAGES,
);

NewPractitioner.validationName = 'Practitioner';

module.exports = { NewPractitioner };
