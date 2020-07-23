const joi = require('@hapi/joi');
const {
  joiValidationDecorator,
} = require('../../../utilities/JoiValidationDecorator');
const {
  STATE_NOT_AVAILABLE,
  US_STATES,
  US_STATES_OTHER,
} = require('../EntityConstants');

/**
 * PublicContact
 * Represents the view of the public case.
 *
 * @param {object} rawContact the raw case data
 * @constructor
 */
function PublicContact(rawContact) {
  this.name = rawContact.name;
  this.state = rawContact.state;
}

joiValidationDecorator(
  PublicContact,
  joi.object().keys({
    name: joi.string().max(500).optional(),
    state: joi
      .string()
      .valid(...Object.keys(US_STATES), ...US_STATES_OTHER, STATE_NOT_AVAILABLE)
      .optional(),
  }),
  {},
);

module.exports = { PublicContact };
