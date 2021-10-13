const joi = require('joi');
const {
  joiValidationDecorator,
  validEntityDecorator,
} = require('../JoiValidationDecorator');
const { JoiValidationConstants } = require('../JoiValidationConstants');

/**
 * HearingNote entity
 *
 * @param {object} rawProps the raw note data
 * @constructor
 */
function HearingNote() {
  this.entityName = 'HearingNote';
}

HearingNote.prototype.init = function (rawProps) {
  this.note = rawProps.note;
};

HearingNote.VALIDATION_ERROR_MESSAGES = {
  note: [
    {
      contains: 'length must be less than or equal',
      message: 'Limit is 200 characters. Enter 200 or fewer characters.',
    },
    'Add a note',
  ],
};

HearingNote.schema = joi.object().keys({
  note: JoiValidationConstants.STRING.max(200).required(),
});

joiValidationDecorator(
  HearingNote,
  HearingNote.schema,
  HearingNote.VALIDATION_ERROR_MESSAGES,
);

module.exports = { HearingNote: validEntityDecorator(HearingNote) };
