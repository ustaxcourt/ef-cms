const joi = require('joi');
const {
  JoiValidationConstants,
} = require('../../utilities/JoiValidationConstants');
const {
  joiValidationDecorator,
  validEntityDecorator,
} = require('../../utilities/JoiValidationDecorator');
const { ROLES } = require('./EntityConstants');
const { SERVICE_INDICATOR_TYPES } = require('./EntityConstants');
const { USER_CONTACT_VALIDATION_RULES, userDecorator } = require('./User');

const entityName = 'PrivatePractitioner';

/**
 * constructor
 *
 * @param {object} rawUser the raw user data
 * @constructor
 */
function PrivatePractitioner() {
  this.entityName = entityName;
}

PrivatePractitioner.prototype.init = function init(rawUser) {
  userDecorator(this, rawUser);
  this.barNumber = rawUser.barNumber;
  this.firmName = rawUser.firmName;
  this.representing = rawUser.representing || [];
  this.representingPrimary = rawUser.representingPrimary;
  this.representingSecondary = rawUser.representingSecondary;
  this.serviceIndicator =
    rawUser.serviceIndicator || SERVICE_INDICATOR_TYPES.SI_ELECTRONIC;
};

PrivatePractitioner.validationName = 'PrivatePractitioner';

PrivatePractitioner.VALIDATION_RULES = joi.object().keys({
  barNumber: JoiValidationConstants.STRING.max(100)
    .required()
    .description(
      'A unique identifier comprising of the practitioner initials, date, and series number.',
    ),
  contact: joi.object().keys(USER_CONTACT_VALIDATION_RULES).optional(),
  email: JoiValidationConstants.EMAIL.optional(),
  entityName: JoiValidationConstants.STRING.valid(
    'PrivatePractitioner',
  ).required(),
  firmName: JoiValidationConstants.STRING.max(100)
    .optional()
    .allow(null)
    .description('The firm name for the practitioner.'),
  name: JoiValidationConstants.STRING.max(100).required(),
  representing: joi
    .array()
    .items(JoiValidationConstants.UUID)
    .optional()
    .description('List of contact IDs of contacts'),
  representingPrimary: joi.boolean().optional(),
  representingSecondary: joi.boolean().optional(),
  role: JoiValidationConstants.STRING.required().valid(
    ROLES.privatePractitioner,
  ),
  serviceIndicator: JoiValidationConstants.STRING.valid(
    ...Object.values(SERVICE_INDICATOR_TYPES),
  ).required(),
  token: JoiValidationConstants.STRING.optional(),
  userId: JoiValidationConstants.UUID.required(),
});

joiValidationDecorator(
  PrivatePractitioner,
  PrivatePractitioner.VALIDATION_RULES,
  {},
);

module.exports = {
  PrivatePractitioner: validEntityDecorator(PrivatePractitioner),
  entityName,
};
