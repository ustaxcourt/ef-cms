const {
  isAuthorized,
  TRIAL_SESSIONS,
} = require('../../../authorization/authorizationClientService');
const { TrialSession } = require('../../entities/TrialSession');
const { UnauthorizedError } = require('../../../errors/errors');

/**
 * createTrialSession
 * @param trialSession
 * @param applicationContext
 * @returns {*|Promise<*>}
 */
exports.createTrialSession = async ({ applicationContext, trialSession }) => {
  const user = applicationContext.getCurrentUser();

  const trialSessionEntity = new TrialSession(trialSession);

  if (!isAuthorized(user, TRIAL_SESSIONS)) {
    throw new UnauthorizedError('Unauthorized');
  }

  const createdTrialSession = await applicationContext
    .getPersistenceGateway()
    .createTrialSession({
      applicationContext,
      trialSession: trialSessionEntity.validate().toRawObject(),
    });

  return createdTrialSession.trialSessionId;
};
