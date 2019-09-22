const joi = require('joi-browser');
const {
  joiValidationDecorator,
} = require('../../utilities/JoiValidationDecorator');
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
}

joiValidationDecorator(
  Respondent,
  joi.object().keys(userValidation),
  undefined,
  VALIDATION_ERROR_MESSAGES,
);

Respondent.validationName = 'Respondent';

module.exports = {
  Respondent,
};
