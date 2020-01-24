const joi = require('@hapi/joi');
const {
  joiValidationDecorator,
} = require('../../utilities/JoiValidationDecorator');

const {
  constants,
} = require('../../business/utilities/setServiceIndicatorsForCase');
const {
  userDecorator,
  userValidation,
  VALIDATION_ERROR_MESSAGES,
} = require('./User');

/**
 * constructor
 *
 * @param {object} rawUser the raw user data
 * @constructor
 */
function Respondent(rawUser) {
  userDecorator(this, rawUser);
  this.serviceIndicator = rawUser.serviceIndicator || constants.SI_ELECTRONIC;
}

joiValidationDecorator(
  Respondent,
  joi.object().keys({
    ...userValidation,
    serviceIndicator: joi
      .string()
      .valid(...Object.values(constants))
      .required(),
  }),
  undefined,
  VALIDATION_ERROR_MESSAGES,
);

Respondent.validationName = 'Respondent';

module.exports = {
  Respondent,
};
