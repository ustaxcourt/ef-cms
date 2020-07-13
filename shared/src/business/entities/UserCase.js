const joi = require('@hapi/joi');
const {
  joiValidationDecorator,
} = require('../../utilities/JoiValidationDecorator');
const { Case } = require('./cases/Case');

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
  this.status = rawUserCase.status;
}

joiValidationDecorator(
  UserCase,
  joi.object().keys({
    caseCaption: Case.VALIDATION_RULES.caseCaption,
    caseId: Case.VALIDATION_RULES.caseId,
    docketNumber: Case.VALIDATION_RULES.docketNumber,
    docketNumberWithSuffix: Case.VALIDATION_RULES.docketNumberWithSuffix,
    leadCaseId: Case.VALIDATION_RULES.leadCaseId,
    status: Case.VALIDATION_RULES.status,
  }),
  Case.VALIDATION_ERROR_MESSAGES,
);

exports.UserCase = UserCase;
