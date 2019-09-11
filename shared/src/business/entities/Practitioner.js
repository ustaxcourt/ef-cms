const joi = require('joi-browser');
const {
  joiValidationDecorator,
} = require('../../utilities/JoiValidationDecorator');

const { respondentDecorator, respondentValidation } = require('./Respondent');

/**
 * constructor
 *
 * @param {object} rawUser the raw user data
 * @constructor
 */
function Practitioner(rawUser) {
  respondentDecorator(this, rawUser);
  this.representingPrimary = rawUser.representingPrimary;
  this.representingSecondary = rawUser.representingSecondary;
}

joiValidationDecorator(
  Practitioner,
  joi.object().keys({
    ...respondentValidation,
    representingPrimary: joi.boolean().optional(),
    representingSecondary: joi.boolean().optional(),
  }),
  undefined,
  {},
);

Practitioner.validationName = 'Practitioner';

module.exports = { Practitioner };
