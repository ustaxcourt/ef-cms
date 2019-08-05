/**
 * validateTrialSessionInteractor
 * @param applicationContext
 * @param trialSession
 * @returns {object}
 */
exports.validateTrialSessionInteractor = ({
  applicationContext,
  trialSession,
}) => {
  const errors = new (applicationContext.getEntityConstructors()).TrialSession(
    trialSession,
  ).getFormattedValidationErrors();
  return errors || null;
};
