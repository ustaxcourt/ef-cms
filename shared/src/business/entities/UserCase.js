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
  this.caseId = rawUserCase.caseId;
  this.caseCaption = rawUserCase.caseCaption;
  this.createdAt = rawUserCase.createdAt;
  this.docketNumber = rawUserCase.docketNumber;
  this.docketNumberWithSuffix = rawUserCase.docketNumberWithSuffix;
  this.leadCaseId = rawUserCase.leadCaseId;
}

joiValidationDecorator(
  UserCase,
  joi.object().keys({
    caseCaption: Case.validationRules.caseCaption,
    caseId: Case.validationRules.caseId,
    docketNumber: Case.validationRules.docketNumber,
    docketNumberWithSuffix: Case.validationRules.docketNumberWithSuffix,
    leadCaseId: Case.validationRules.leadCaseId,
  }),
  Case.VALIDATION_ERROR_MESSAGES,
);

exports.UserCase = UserCase;
