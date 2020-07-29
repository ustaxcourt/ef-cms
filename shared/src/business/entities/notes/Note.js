const joi = require('joi');
const {
  joiValidationDecorator,
} = require('../../../utilities/JoiValidationDecorator');

Note.validationName = 'Note';

/**
 * Note entity
 *
 * @param {object} rawProps the raw note data
 * @constructor
 */
function Note(rawProps) {
  this.notes = rawProps.notes;
}

Note.VALIDATION_ERROR_MESSAGES = {
  notes: 'Add note',
};

Note.schema = joi.object().keys({
  notes: joi.string().required(),
});

joiValidationDecorator(Note, Note.schema, Note.VALIDATION_ERROR_MESSAGES);

module.exports = { Note };
