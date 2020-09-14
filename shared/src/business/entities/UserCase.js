const joi = require('joi');
const {
  JoiValidationConstants,
} = require('../../utilities/JoiValidationConstants');
const {
  joiValidationDecorator,
  validEntityDecorator,
} = require('../../utilities/JoiValidationDecorator');
const { Case } = require('./cases/Case');
const { createISODateString } = require('../utilities/DateHandler');

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
};

UserCase.validationName = 'UserCase';

joiValidationDecorator(
  UserCase,
  joi.object().keys({
    caseCaption: Case.VALIDATION_RULES.caseCaption,
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
