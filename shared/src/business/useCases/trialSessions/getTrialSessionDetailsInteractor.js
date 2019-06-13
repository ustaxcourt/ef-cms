const {
  isAuthorized,
  TRIAL_SESSIONS,
} = require('../../../authorization/authorizationClientService');
const { UnauthorizedError } = require('../../../errors/errors');

/**
 * getTrialSessionsDetails
 * @param applicationContext
 * @returns {*|Promise<*>}
 */
exports.getTrialSessionDetails = async ({ applicationContext }) => {
  const user = applicationContext.getCurrentUser();
  if (!isAuthorized(user, TRIAL_SESSIONS)) {
    throw new UnauthorizedError('Unauthorized');
  }

  const trialSessionDetails = {};
  // await applicationContext
  //   .getPersistenceGateway()
  //   .getSessionInfo({
  //     applicationContext,
  //   });

  return trialSessionDetails;
};
