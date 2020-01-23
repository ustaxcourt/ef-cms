const joi = require('@hapi/joi');
const {
  joiValidationDecorator,
} = require('../../utilities/JoiValidationDecorator');

const {
  constants,
} = require('../../business/utilities/setServiceIndicatorsForCase');
const { userDecorator, userValidation } = require('./User');

/**
 * constructor
 *
 * @param {object} rawUser the raw user data
 * @constructor
 */
function Practitioner(rawUser) {
  userDecorator(this, rawUser);
  this.representingPrimary = rawUser.representingPrimary;
  this.representingSecondary = rawUser.representingSecondary;
  this.serviceIndicator = rawUser.serviceIndicator;
}

joiValidationDecorator(
  Practitioner,
  joi.object().keys({
    ...userValidation,
    representingPrimary: joi.boolean().optional(),
    representingSecondary: joi.boolean().optional(),
    serviceIndicator: joi
      .string()
      .valid(...Object.values(constants))
      .required(),
  }),
  undefined,
  {},
);

Practitioner.validationName = 'Practitioner';

module.exports = { Practitioner };
