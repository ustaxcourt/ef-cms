const joi = require('joi');
const {
  JoiValidationConstants,
} = require('../../../utilities/JoiValidationConstants');
const {
  joiValidationDecorator,
  validEntityDecorator,
} = require('../../../utilities/JoiValidationDecorator');

Note.validationName = 'Note';

/**
 * Note entity
 *
 * @param {object} rawProps the raw note data
 * @constructor
 */
function Note() {}
Note.prototype.init = function (rawProps) {
  this.notes = rawProps.notes;
};

Note.VALIDATION_ERROR_MESSAGES = {
  notes: 'Add note',
};

Note.schema = joi.object().keys({
  notes: JoiValidationConstants.STRING.required(),
});

joiValidationDecorator(Note, Note.schema, Note.VALIDATION_ERROR_MESSAGES);

module.exports = { Note: validEntityDecorator(Note) };
