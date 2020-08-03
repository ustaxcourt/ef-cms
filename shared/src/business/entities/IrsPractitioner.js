const joi = require('joi');
const {
  joiValidationDecorator,
} = require('../../utilities/JoiValidationDecorator');
const {
  userDecorator,
  userValidation,
  VALIDATION_ERROR_MESSAGES,
} = require('./User');
const { ROLES, SERVICE_INDICATOR_TYPES } = require('./EntityConstants');

/**
 * constructor
 *
 * @param {object} rawUser the raw user data
 * @constructor
 */
function IrsPractitioner(rawUser) {
  userDecorator(this, rawUser);
  this.entityName = 'IrsPractitioner';
  this.serviceIndicator =
    rawUser.serviceIndicator || SERVICE_INDICATOR_TYPES.SI_ELECTRONIC;
}

IrsPractitioner.VALIDATION_RULES = joi.object().keys({
  ...userValidation,
  entityName: joi.string().valid('IrsPractitioner').required(),
  role: joi.string().valid(ROLES.irsPractitioner).required(),
  serviceIndicator: joi
    .string()
    .valid(...Object.values(SERVICE_INDICATOR_TYPES))
    .required(),
});

joiValidationDecorator(
  IrsPractitioner,
  IrsPractitioner.VALIDATION_RULES,
  VALIDATION_ERROR_MESSAGES,
);

IrsPractitioner.validationName = 'IrsPractitioner';

module.exports = {
  IrsPractitioner,
};
