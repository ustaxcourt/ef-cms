const joi = require('@hapi/joi');
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
  this.entityName = 'PublicContact';

  this.name = rawContact.name;
  this.state = rawContact.state;
}

joiValidationDecorator(
  PublicContact,
  joi.object().keys({
    entityName: joi.string().valid('PublicContact').required(),
    name: joi.string().optional(),
    state: joi.string().optional(),
  }),
  undefined,
  {},
);

module.exports = { PublicContact };
