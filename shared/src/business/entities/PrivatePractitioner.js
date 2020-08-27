const joi = require('joi');
const {
  JoiValidationConstants,
} = require('../../utilities/JoiValidationConstants');
const {
  joiValidationDecorator,
} = require('../../utilities/JoiValidationDecorator');
const { ROLES } = require('./EntityConstants');
const { SERVICE_INDICATOR_TYPES } = require('./EntityConstants');
const { USER_CONTACT_VALIDATION_RULES, userDecorator } = require('./User');

/**
 * constructor
 *
 * @param {object} rawUser the raw user data
 * @constructor
 */
function PrivatePractitioner(rawUser) {
  userDecorator(this, rawUser);
  this.barNumber = rawUser.barNumber;
  this.entityName = 'PrivatePractitioner';
  this.representing = rawUser.representing || [];
  this.representingPrimary = rawUser.representingPrimary;
  this.representingSecondary = rawUser.representingSecondary;
  this.serviceIndicator =
    rawUser.serviceIndicator || SERVICE_INDICATOR_TYPES.SI_ELECTRONIC;
}

PrivatePractitioner.VALIDATION_RULES = joi.object().keys({
  barNumber: joi
    .string()
    .max(100)
    .required()
    .description(
      'A unique identifier comprising of the practitioner initials, date, and series number.',
    ),
  contact: joi.object().keys(USER_CONTACT_VALIDATION_RULES).optional(),
  email: JoiValidationConstants.EMAIL.optional(),
  entityName: joi.string().valid('PrivatePractitioner').required(),
  name: joi.string().max(100).required(),
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
  token: joi.string().optional(),
  userId: JoiValidationConstants.UUID.required(),
});

joiValidationDecorator(
  PrivatePractitioner,
  PrivatePractitioner.VALIDATION_RULES,
  {},
);

PrivatePractitioner.validationName = 'PrivatePractitioner';

module.exports = { PrivatePractitioner };
