const joi = require('joi-browser');
const {
  joiValidationDecorator,
} = require('../../utilities/JoiValidationDecorator');
const { userDecorator, userValidation, validationErrorMap } = require('./User');

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
  validationErrorMap,
);

Respondent.validationName = 'Respondent';

module.exports = {
  Respondent,
};
