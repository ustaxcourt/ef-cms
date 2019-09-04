const {
  isAuthorized,
  TRIAL_SESSIONS,
} = require('../../../authorization/authorizationClientService');
const { TrialSession } = require('../../entities/trialSessions/TrialSession');
const { UnauthorizedError } = require('../../../errors/errors');

/**
 * setTrialSessionAsSwingSessionInteractor
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {string} providers.swingSessionId the id of the trial session to add as a swing session
 * @param {string} providers.trialSessionId the trial session to add the swing session to
 * @returns {Promise} the promise of the updateTrialSession call
 */
exports.setTrialSessionAsSwingSessionInteractor = async ({
  applicationContext,
  swingSessionId,
  trialSessionId,
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

  const trialSessionEntity = new TrialSession(trialSession, {
    applicationContext,
  });

  trialSessionEntity.setAsSwingSession(swingSessionId);

  return await applicationContext.getPersistenceGateway().updateTrialSession({
    applicationContext,
    trialSessionToUpdate: trialSessionEntity.validate().toRawObject(),
  });
};
