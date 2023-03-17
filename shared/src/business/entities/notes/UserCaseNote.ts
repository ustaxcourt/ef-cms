const joi = require('joi');
const {
  joiValidationDecorator,
  validEntityDecorator,
} = require('../JoiValidationDecorator');
const { JoiValidationConstants } = require('../JoiValidationConstants');

/**
 * User's Case Note entity
 *
 * @param {object} rawProps the raw case note data
 * @constructor
 */
function UserCaseNote() {
  this.entityName = 'UserCaseNote';
}

UserCaseNote.prototype.init = function init(rawProps) {
  this.docketNumber = rawProps.docketNumber;
  this.userId = rawProps.userId;
  this.notes = rawProps.notes;
};

UserCaseNote.VALIDATION_ERROR_MESSAGES = {
  notes: 'Add note',
};

UserCaseNote.schema = joi.object().keys({
  docketNumber: JoiValidationConstants.DOCKET_NUMBER.required(),
  entityName: JoiValidationConstants.STRING.valid('UserCaseNote').required(),
  notes: JoiValidationConstants.STRING.required(),
  userId: JoiValidationConstants.UUID.required(),
});

joiValidationDecorator(
  UserCaseNote,
  UserCaseNote.schema,
  UserCaseNote.VALIDATION_ERROR_MESSAGES,
);

module.exports = { UserCaseNote: validEntityDecorator(UserCaseNote) };
