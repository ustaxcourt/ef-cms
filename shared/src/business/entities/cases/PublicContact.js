const joi = require('joi');
const {
  JoiValidationConstants,
} = require('../../../utilities/JoiValidationConstants');
const {
  joiValidationDecorator,
  validEntityDecorator,
} = require('../../../utilities/JoiValidationDecorator');

/**
 * PublicContact
 * Represents the view of the public case.
 *
 * @param {object} rawContact the raw case data
 * @constructor
 */
function PublicContact() {
  this.entityName = 'PublicContact';
}

PublicContact.prototype.init = function init(rawContact) {
  this.name = rawContact.name;
  this.state = rawContact.state;
};

PublicContact.VALIDATION_RULES = joi.object().keys({
  name: JoiValidationConstants.STRING.max(500).optional(),
  state: JoiValidationConstants.STRING.optional(),
});

joiValidationDecorator(PublicContact, PublicContact.VALIDATION_RULES, {});

module.exports = { PublicContact: validEntityDecorator(PublicContact) };
