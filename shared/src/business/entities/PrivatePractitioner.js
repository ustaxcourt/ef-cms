const joi = require('joi');
const {
  JoiValidationConstants,
} = require('../../utilities/JoiValidationConstants');
const {
  joiValidationDecorator,
  validEntityDecorator,
} = require('../../utilities/JoiValidationDecorator');
const { Practitioner } = require('./Practitioner');
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

PrivatePractitioner.prototype.init = function init(
  rawUser,
  { filtered = false } = {},
) {
  userDecorator(this, rawUser, filtered);
  this.barNumber = rawUser.barNumber;
  this.firmName = rawUser.firmName;
  this.representing = rawUser.representing || [];
  this.serviceIndicator =
    rawUser.serviceIndicator ||
    Practitioner.getDefaultServiceIndicator(rawUser);
};

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

PrivatePractitioner.prototype.isRepresenting = function isRepresenting(
  petitionerContactId,
) {
  return this.representing.includes(petitionerContactId);
};

module.exports = {
  PrivatePractitioner: validEntityDecorator(PrivatePractitioner),
  entityName,
};
