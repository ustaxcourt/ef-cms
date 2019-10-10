const joi = require('joi-browser');
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
    startDate: joi
      .date()
      .iso()
      .min('now')
      .required(),
  }),
  function() {
    return !this.getFormattedValidationErrors();
  },
  NewTrialSession.VALIDATION_ERROR_MESSAGES,
);

module.exports = { NewTrialSession };
