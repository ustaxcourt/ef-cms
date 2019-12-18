const joi = require('joi-browser');
const {
  joiValidationDecorator,
} = require('../../../utilities/JoiValidationDecorator');

JudgesCaseNote.validationName = 'JudgesCaseNote';

/**
 * Judge's Case Note entity
 *
 * @param {object} rawProps the raw case note data
 * @constructor
 */
function JudgesCaseNote(rawProps) {
  this.caseId = rawProps.caseId;
  this.userId = rawProps.userId;
  this.notes = rawProps.notes;
}

JudgesCaseNote.VALIDATION_ERROR_MESSAGES = {
  notes: 'Enter note',
};

JudgesCaseNote.schema = joi.object().keys({
  caseId: joi
    .string()
    .uuid({
      version: ['uuidv4'],
    })
    .required(),
  notes: joi.string().required(),
  userId: joi
    .string()
    .uuid({
      version: ['uuidv4'],
    })
    .required(),
});

joiValidationDecorator(
  JudgesCaseNote,
  JudgesCaseNote.schema,
  undefined,
  JudgesCaseNote.VALIDATION_ERROR_MESSAGES,
);

module.exports = { JudgesCaseNote };
