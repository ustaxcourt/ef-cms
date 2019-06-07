const {
  isAuthorized,
  TRIAL_SESSIONS,
} = require('../../../authorization/authorizationClientService');
const { TrialSession } = require('../../entities/TrialSession');
const { UnauthorizedError } = require('../../../errors/errors');

/**
 * setTrialSessionAsSwingSession
 * @param trialSessionId
 * @param swingSessionId
 * @param applicationContext
 * @returns {*|Promise<*>}
 */
exports.setTrialSessionAsSwingSession = async ({
  applicationContext,
  trialSessionId,
  swingSessionId,
}) => {
  const user = applicationContext.getCurrentUser();

  if (!isAuthorized(user, TRIAL_SESSIONS)) {
    throw new UnauthorizedError('Unauthorized');
  }

  const trialSession = await applicationContext
    .getPersistenceGateway()
    .getTrialSessionById({
      applicationContext,
      trialSessionId,
    });

  const trialSessionEntity = new TrialSession(trialSession);

  trialSessionEntity.setAsSwingSession(swingSessionId);

  return await applicationContext.getPersistenceGateway().updateTrialSession({
    applicationContext,
    trialSessionToUpdate: trialSessionEntity.validate().toRawObject(),
  });
};
