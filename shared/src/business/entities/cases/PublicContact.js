const joi = require('joi');
const {
  JoiValidationConstants,
} = require('../../../utilities/JoiValidationConstants');
const {
  joiValidationDecorator,
  validEntityDecorator,
} = require('../../../utilities/JoiValidationDecorator');
const { CONTACT_TYPES } = require('../EntityConstants');

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
  this.contactId = rawContact.contactId;
  this.contactType = rawContact.contactType;
  this.name = rawContact.name;
  this.state = rawContact.state;
};

PublicContact.VALIDATION_RULES = joi.object().keys({
  contactId: JoiValidationConstants.UUID.required(),
  contactType: JoiValidationConstants.STRING.valid(
    ...Object.values(CONTACT_TYPES),
  ).optional(),
  name: JoiValidationConstants.STRING.max(500).optional(),
  state: JoiValidationConstants.STRING.optional(),
});

joiValidationDecorator(PublicContact, PublicContact.VALIDATION_RULES, {});

module.exports = { PublicContact: validEntityDecorator(PublicContact) };
