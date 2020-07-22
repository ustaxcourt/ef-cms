const joi = require('@hapi/joi');
const {
  JoiValidationConstants,
} = require('../../utilities/JoiValidationConstants');
const {
  joiValidationDecorator,
} = require('../../utilities/JoiValidationDecorator');
const { ROLES } = require('./EntityConstants');
const { SERVICE_INDICATOR_TYPES } = require('./EntityConstants');
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
  this.representing = rawUser.representing || [];
  this.serviceIndicator =
    rawUser.serviceIndicator || SERVICE_INDICATOR_TYPES.SI_ELECTRONIC;
}

joiValidationDecorator(
  PrivatePractitioner,
  joi.object().keys({
    ...userValidation,
    entityName: joi.string().valid('PrivatePractitioner').required(),
    representing: joi
      .array()
      .items(JoiValidationConstants.UUID)
      .optional()
      .description('List of contact IDs of contacts'),
    representingPrimary: joi.boolean().optional(),
    representingSecondary: joi.boolean().optional(),
    role: joi.string().required().valid(ROLES.privatePractitioner),
    serviceIndicator: joi
      .string()
      .valid(...Object.values(SERVICE_INDICATOR_TYPES))
      .required(),
  }),
  {},
);

PrivatePractitioner.validationName = 'PrivatePractitioner';

module.exports = { PrivatePractitioner };
