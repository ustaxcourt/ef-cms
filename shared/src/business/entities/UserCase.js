const joi = require('joi');
const {
  joiValidationDecorator,
  validEntityDecorator,
} = require('./JoiValidationDecorator');
const { Case } = require('./cases/Case');
const { createISODateString } = require('../utilities/DateHandler');
const { JoiValidationConstants } = require('./JoiValidationConstants');

/**
 * UserCase Entity
 * represents a user-to-case mapping record
 *
 * @param {object} rawUserCase the raw user-case data
 * @constructor
 */
function UserCase() {
  this.entityName = 'UserCase';
}

UserCase.prototype.init = function init(rawUserCase) {
  this.caseCaption = rawUserCase.caseCaption;
  this.createdAt = rawUserCase.createdAt || createISODateString();
  this.docketNumber = rawUserCase.docketNumber;
  this.docketNumberWithSuffix = rawUserCase.docketNumberWithSuffix;
  this.leadDocketNumber = rawUserCase.leadDocketNumber;
  this.status = rawUserCase.status;
  this.closedDate = rawUserCase.closedDate;
};

joiValidationDecorator(
  UserCase,
  joi.object().keys({
    caseCaption: Case.VALIDATION_RULES.caseCaption,
    closedDate: Case.VALIDATION_RULES.closedDate,
    createdAt: Case.VALIDATION_RULES.createdAt,
    docketNumber: Case.VALIDATION_RULES.docketNumber,
    docketNumberWithSuffix: Case.VALIDATION_RULES.docketNumberWithSuffix,
    entityName: JoiValidationConstants.STRING.valid('UserCase').required(),
    leadDocketNumber: Case.VALIDATION_RULES.leadDocketNumber,
    status: Case.VALIDATION_RULES.status,
  }),
  Case.VALIDATION_ERROR_MESSAGES,
);

exports.UserCase = validEntityDecorator(UserCase);
