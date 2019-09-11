const joi = require('joi-browser');
const {
  joiValidationDecorator,
} = require('../../utilities/JoiValidationDecorator');

const { userDecorator, userValidation } = require('./User');

/**
 * constructor
 *
 * @param {object} rawUser the raw user data
 * @constructor
 */
function Practitioner(rawUser) {
  userDecorator(this, rawUser);
  this.representingPrimary = rawUser.representingPrimary;
  this.representingSecondary = rawUser.representingSecondary;
}

joiValidationDecorator(
  Practitioner,
  joi.object().keys({
    ...userValidation,
    representingPrimary: joi.boolean().optional(),
    representingSecondary: joi.boolean().optional(),
  }),
  undefined,
  {},
);

Practitioner.validationName = 'Practitioner';

module.exports = { Practitioner };
