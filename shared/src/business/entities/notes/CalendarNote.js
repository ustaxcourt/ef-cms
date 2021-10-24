const joi = require('joi');
const {
  joiValidationDecorator,
  validEntityDecorator,
} = require('../JoiValidationDecorator');
const { JoiValidationConstants } = require('../JoiValidationConstants');

/**
 * CalendarNote entity
 *
 * @param {object} rawProps the raw note data
 * @constructor
 */
function CalendarNote() {
  this.entityName = 'CalendarNote';
}

CalendarNote.prototype.init = function (rawProps) {
  this.note = rawProps.note;
};

CalendarNote.VALIDATION_ERROR_MESSAGES = {
  note: 'Limit is 200 characters. Enter 200 or fewer characters.',
};

CalendarNote.schema = joi.object().keys({
  note: JoiValidationConstants.STRING.max(200).allow('', null).optional(),
});

joiValidationDecorator(
  CalendarNote,
  CalendarNote.schema,
  CalendarNote.VALIDATION_ERROR_MESSAGES,
);

module.exports = { CalendarNote: validEntityDecorator(CalendarNote) };
