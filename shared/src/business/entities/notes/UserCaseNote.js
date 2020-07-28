const joi = require('joi');
const {
  JoiValidationConstants,
} = require('../../../utilities/JoiValidationConstants');
const {
  joiValidationDecorator,
} = require('../../../utilities/JoiValidationDecorator');
UserCaseNote.validationName = 'UserCaseNote';

/**
 * User's Case Note entity
 *
 * @param {object} rawProps the raw case note data
 * @constructor
 */
function UserCaseNote(rawProps) {
  this.entityName = 'UserCaseNote';
  this.docketNumber = rawProps.docketNumber;
  this.userId = rawProps.userId;
  this.notes = rawProps.notes;
}

UserCaseNote.VALIDATION_ERROR_MESSAGES = {
  notes: 'Add note',
};

UserCaseNote.schema = joi.object().keys({
  docketNumber: JoiValidationConstants.DOCKET_NUMBER.required(),
  entityName: joi.string().valid('UserCaseNote').required(),
  notes: joi.string().required(),
  userId: JoiValidationConstants.UUID.required(),
});

joiValidationDecorator(
  UserCaseNote,
  UserCaseNote.schema,
  UserCaseNote.VALIDATION_ERROR_MESSAGES,
);

module.exports = { UserCaseNote };
