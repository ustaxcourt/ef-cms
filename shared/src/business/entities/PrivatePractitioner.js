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
function PrivatePractitioner(rawUser) {
  userDecorator(this, rawUser);
  this.entityName = 'PrivatePractitioner';
  this.representingPrimary = rawUser.representingPrimary;
  this.representingSecondary = rawUser.representingSecondary;
  this.serviceIndicator =
    rawUser.serviceIndicator || SERVICE_INDICATOR_TYPES.SI_ELECTRONIC;
}

joiValidationDecorator(
  PrivatePractitioner,
  joi.object().keys({
    ...userValidation,
    entityName: joi.string().valid('PrivatePractitioner').required(),
    representingPrimary: joi.boolean().optional(),
    representingSecondary: joi.boolean().optional(),
    serviceIndicator: joi
      .string()
      .valid(...Object.values(SERVICE_INDICATOR_TYPES))
      .required(),
  }),
  {},
);

PrivatePractitioner.validationName = 'PrivatePractitioner';

module.exports = { PrivatePractitioner };
