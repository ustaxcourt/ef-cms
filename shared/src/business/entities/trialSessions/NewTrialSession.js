const joi = require('joi');
const {
  joiValidationDecorator,
  validEntityDecorator,
} = require('../JoiValidationDecorator');
const { JoiValidationConstants } = require('../JoiValidationConstants');
const { TrialSession } = require('./TrialSession');

/**
 * constructor
 *
 * @param {object} rawSession the raw session data
 * @constructor
 */
function NewTrialSession() {
  this.entityName = 'TrialSession';
}

NewTrialSession.prototype.init = function init(
  rawSession,
  { applicationContext },
) {
  this.trialClerkId = rawSession.trialClerkId;
  TrialSession.prototype.init.call(this, rawSession, { applicationContext });
};

NewTrialSession.VALIDATION_ERROR_MESSAGES = {
  ...TrialSession.VALIDATION_ERROR_MESSAGES,
  alternateTrialClerkName:
    'A valid Alternate Trial Clerk name must be provided if "Other" is selected',
};

joiValidationDecorator(
  NewTrialSession,
  joi.object().keys({
    ...TrialSession.validationRules.COMMON,
    alternateTrialClerkName: joi.when('trialClerkId', {
      is: 'Other',
      otherwise: joi.optional(),
      then: JoiValidationConstants.STRING.max(100).required(),
    }),
    startDate: JoiValidationConstants.ISO_DATE.min('now').required(),
  }),
  NewTrialSession.VALIDATION_ERROR_MESSAGES,
);

module.exports = { NewTrialSession: validEntityDecorator(NewTrialSession) };
