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
};

NewPractitioner.validationName = 'Practitioner';

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
    admissionsStatus: JoiValidationConstants.STRING.required(),
    barNumber: JoiValidationConstants.STRING.optional().allow(null),
    email: JoiValidationConstants.STRING.required(),
    firstName: JoiValidationConstants.STRING.required(),
    lastName: JoiValidationConstants.STRING.required(),
    role: JoiValidationConstants.STRING.optional().allow(null),
    userId: JoiValidationConstants.STRING.optional().allow(null),
  }),
  VALIDATION_ERROR_MESSAGES,
);

exports.NewPractitioner = validEntityDecorator(NewPractitioner);
