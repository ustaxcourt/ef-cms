/**
 * validateTrialSession
 * @param applicationContext
 * @param trialSession
 * @returns {Object}
 */
exports.validateTrialSession = ({ trialSession, applicationContext }) => {
  const errors = new (applicationContext.getEntityConstructors()).TrialSession(
    trialSession,
  ).getFormattedValidationErrors();
  if (!errors) return null;

  return errors;
};
