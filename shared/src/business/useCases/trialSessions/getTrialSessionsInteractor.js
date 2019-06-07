const {
  isAuthorized,
  TRIAL_SESSIONS,
} = require('../../../authorization/authorizationClientService');
const { TrialSession } = require('../../entities/TrialSession');
const { UnauthorizedError } = require('../../../errors/errors');

/**
 * getTrialSessions
 * @param applicationContext
 * @returns {*|Promise<*>}
 */
exports.getTrialSessions = async ({ applicationContext }) => {
  const user = applicationContext.getCurrentUser();
  if (!isAuthorized(user, TRIAL_SESSIONS)) {
    throw new UnauthorizedError('Unauthorized');
  }

  const trialSessions = await applicationContext
    .getPersistenceGateway()
    .getTrialSessions({
      applicationContext,
    });

  return TrialSession.validateRawCollection(trialSessions);
};
