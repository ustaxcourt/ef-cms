const joi = require('joi');
const {
  JoiValidationConstants,
} = require('../../utilities/JoiValidationConstants');
const {
  joiValidationDecorator,
  validEntityDecorator,
} = require('../../utilities/JoiValidationDecorator');
const {
  USER_CONTACT_VALIDATION_RULES,
  userDecorator,
  VALIDATION_ERROR_MESSAGES,
} = require('./User');
const { ROLES, SERVICE_INDICATOR_TYPES } = require('./EntityConstants');

const entityName = 'IrsPractitioner';

/**
 * constructor
 *
 * @param {object} rawUser the raw user data
 * @constructor
 */
function IrsPractitioner() {
  this.entityName = entityName;
}

IrsPractitioner.prototype.init = function init(rawUser) {
  userDecorator(this, rawUser);
  this.barNumber = rawUser.barNumber;
  this.serviceIndicator =
    rawUser.serviceIndicator || SERVICE_INDICATOR_TYPES.SI_ELECTRONIC;
};

IrsPractitioner.validationName = 'IrsPractitioner';

IrsPractitioner.VALIDATION_RULES = joi.object().keys({
  barNumber: JoiValidationConstants.STRING.max(100)
    .required()
    .description(
      'A unique identifier comprising of the practitioner initials, date, and series number.',
    ),
  contact: joi.object().keys(USER_CONTACT_VALIDATION_RULES).optional(),
  email: JoiValidationConstants.EMAIL.optional(),
  entityName: JoiValidationConstants.STRING.valid('IrsPractitioner').required(),
  name: JoiValidationConstants.STRING.max(100).required(),
  role: JoiValidationConstants.STRING.valid(ROLES.irsPractitioner).required(),
  serviceIndicator: JoiValidationConstants.STRING.valid(
    ...Object.values(SERVICE_INDICATOR_TYPES),
  ).required(),
  token: JoiValidationConstants.STRING.optional(),
  userId: JoiValidationConstants.UUID.required(),
});

joiValidationDecorator(
  IrsPractitioner,
  IrsPractitioner.VALIDATION_RULES,
  VALIDATION_ERROR_MESSAGES,
);

module.exports = {
  IrsPractitioner: validEntityDecorator(IrsPractitioner),
  entityName,
};
