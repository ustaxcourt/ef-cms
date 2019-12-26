const joi = require('joi-browser');
const {
  joiValidationDecorator,
} = require('../../../utilities/JoiValidationDecorator');
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

joiValidationDecorator(PublicContact, joi.object(), undefined, {});

module.exports = { PublicContact };
