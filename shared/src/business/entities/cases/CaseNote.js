const joi = require('joi-browser');
const {
  joiValidationDecorator,
} = require('../../../utilities/JoiValidationDecorator');

CaseNote.validationName = 'CaseNote';

/**
 * Case Note entity
 *
 * @param {object} rawProps the raw case note data
 * @constructor
 */
function CaseNote(rawProps) {
  this.caseId = rawProps.caseId;
  this.userId = rawProps.userId;
  this.notes = rawProps.notes;
}

CaseNote.errorToMessageMap = {
  notes: 'Notes can not be empty.',
};

CaseNote.schema = joi.object().keys({
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
  CaseNote,
  CaseNote.schema,
  undefined,
  CaseNote.errorToMessageMap,
);

module.exports = { CaseNote };
