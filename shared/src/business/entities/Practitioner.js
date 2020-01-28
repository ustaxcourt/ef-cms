const joi = require('@hapi/joi');
const {
  joiValidationDecorator,
} = require('../../utilities/JoiValidationDecorator');
const { SERVICE_INDICATOR_TYPES } = require('./cases/CaseConstants');
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
  this.serviceIndicator =
    rawUser.serviceIndicator || SERVICE_INDICATOR_TYPES.SI_ELECTRONIC;
}

joiValidationDecorator(
  Practitioner,
  joi.object().keys({
    ...userValidation,
    representingPrimary: joi.boolean().optional(),
    representingSecondary: joi.boolean().optional(),
    serviceIndicator: joi
      .string()
      .valid(...Object.values(SERVICE_INDICATOR_TYPES))
      .required(),
  }),
  undefined,
  {},
);

Practitioner.validationName = 'Practitioner';

module.exports = { Practitioner };
