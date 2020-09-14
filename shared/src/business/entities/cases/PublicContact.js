const joi = require('joi');
const {
  JoiValidationConstants,
} = require('../../../utilities/JoiValidationConstants');
const {
  joiValidationDecorator,
  validEntityDecorator,
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
function PublicContact() {}
PublicContact.prototype.init = function init(rawContact) {
  this.name = rawContact.name;
  this.state = rawContact.state;
};

PublicContact.validationName = 'PublicContact';

PublicContact.VALIDATION_RULES = joi.object().keys({
  name: JoiValidationConstants.STRING.max(500).optional(),
  state: JoiValidationConstants.STRING.valid(
    ...Object.keys(US_STATES),
    ...US_STATES_OTHER,
    STATE_NOT_AVAILABLE,
  ).optional(),
});

joiValidationDecorator(PublicContact, PublicContact.VALIDATION_RULES, {});

module.exports = { PublicContact: validEntityDecorator(PublicContact) };
