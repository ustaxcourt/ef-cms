const joi = require('joi');
const {
  JoiValidationConstants,
} = require('../../../utilities/JoiValidationConstants');
const {
  joiValidationDecorator,
  validEntityDecorator,
} = require('../../../utilities/JoiValidationDecorator');

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
      contains: 'ength must be less than or equal',
      message: 'Limit is 200 characters. Enter 200 or fewer characters.',
    },
    {
      contains: 'is required',
      message: 'Add a note',
    },
    {
      contains: 'not allowed to be empty',
      message: 'Add a note',
    },
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
