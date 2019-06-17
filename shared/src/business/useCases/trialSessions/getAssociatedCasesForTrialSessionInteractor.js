const {
  isAuthorized,
  TRIAL_SESSIONS,
} = require('../../../authorization/authorizationClientService');
const { UnauthorizedError } = require('../../../errors/errors');

/**
 * getAssociatedCasesForTrialSession
 * @param applicationContext
 * @param trialSessionId
 * @returns {*|Promise<*>}
 */
exports.getAssociatedCasesForTrialSession = async ({
  applicationContext,
  trialSessionId,
}) => {
  const user = applicationContext.getCurrentUser();
  if (!isAuthorized(user, TRIAL_SESSIONS)) {
    throw new UnauthorizedError('Unauthorized');
  }

  return await applicationContext
    .getPersistenceGateway()
    .getAssociatedCasesForTrialSession({
      applicationContext,
      trialSessionId,
    });
};
