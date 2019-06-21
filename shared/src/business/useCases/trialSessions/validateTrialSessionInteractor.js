/**
 * validateTrialSession
 * @param applicationContext
 * @param trialSession
 * @returns {object}
 */
exports.validateTrialSession = ({ applicationContext, trialSession }) => {
  const errors = new (applicationContext.getEntityConstructors()).TrialSession(
    trialSession,
  ).getFormattedValidationErrors();
  if (!errors) return null;

  return errors;
};
