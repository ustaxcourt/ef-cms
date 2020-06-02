const {
  joiValidationDecorator,
} = require('../../utilities/JoiValidationDecorator');

UserCase.validationName = 'UserCase';

/**
 * UserCase Entity
 * represents a user-to-case mapping record
 *
 * @param {object} rawUserCase the raw user-case data
 * @constructor
 */
function UserCase(rawUserCase) {
  this.entityName = 'UserCase';
  this.caseId = rawUserCase.caseId;
  this.caseCaption = rawUserCase.caseCaption;
  this.createdAt = rawUserCase.createdAt;
  this.docketNumber = rawUserCase.docketNumber;
  this.docketNumberWithSuffix = rawUserCase.docketNumberWithSuffix;
  this.leadCaseId = rawUserCase.leadCaseId;
}

joiValidationDecorator(UserCase, {}, null);

exports.UserCase = UserCase;
