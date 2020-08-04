const joi = require('joi');
const {
  JoiValidationConstants,
} = require('../../../utilities/JoiValidationConstants');
const {
  joiValidationDecorator,
} = require('../../../utilities/JoiValidationDecorator');
const { TrialSession } = require('./TrialSession');

NewTrialSession.validationName = 'TrialSession';

/**
 * constructor
 *
 * @param {object} rawSession the raw session data
 * @constructor
 */
function NewTrialSession(rawSession, { applicationContext }) {
  TrialSession.prototype.init.call(this, rawSession, { applicationContext });
}

NewTrialSession.VALIDATION_ERROR_MESSAGES = {
  ...TrialSession.VALIDATION_ERROR_MESSAGES,
};

joiValidationDecorator(
  NewTrialSession,
  joi.object().keys({
    ...TrialSession.validationRules.COMMON,
    startDate: JoiValidationConstants.ISO_DATE.min('now').required(),
  }),
  NewTrialSession.VALIDATION_ERROR_MESSAGES,
);

module.exports = { NewTrialSession };
