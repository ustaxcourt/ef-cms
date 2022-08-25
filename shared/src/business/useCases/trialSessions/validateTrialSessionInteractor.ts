const {
  NewTrialSession,
} = require('../../entities/trialSessions/NewTrialSession');

/**
 * validateTrialSessionInteractor
 *
 * @param {object} applicationContext the application context
 * @param {object} providers the providers object
 * @param {object} providers.trialSession the trial session data
 * @returns {object} errors (null if no errors)
 */
exports.validateTrialSessionInteractor = (
  applicationContext,
  { trialSession },
) => {
  const errors = new NewTrialSession(trialSession, {
    applicationContext,
  }).getFormattedValidationErrors();
  return errors || null;
};
