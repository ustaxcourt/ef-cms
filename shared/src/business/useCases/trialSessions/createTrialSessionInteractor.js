const {
  isAuthorized,
  ROLE_PERMISSIONS,
} = require('../../../authorization/authorizationClientService');
const {
  TrialSessionWorkingCopy,
} = require('../../entities/trialSessions/TrialSessionWorkingCopy');
const { TrialSession } = require('../../entities/trialSessions/TrialSession');
const { UnauthorizedError } = require('../../../errors/errors');

/**
 * createTrialSessionInteractor
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {object} providers.trialSession the trial session data
 * @returns {object} the created trial session
 */
exports.createTrialSessionInteractor = async ({
  applicationContext,
  trialSession,
}) => {
  const user = applicationContext.getCurrentUser();

  const trialSessionEntity = new TrialSession(trialSession, {
    applicationContext,
  });

  if (!isAuthorized(user, ROLE_PERMISSIONS.TRIAL_SESSIONS)) {
    throw new UnauthorizedError('Unauthorized');
  }

  if (['Motion/Hearing', 'Special'].includes(trialSessionEntity.sessionType)) {
    trialSessionEntity.setAsCalendared();
  }

  const createdTrialSession = await applicationContext
    .getPersistenceGateway()
    .createTrialSession({
      applicationContext,
      trialSession: trialSessionEntity.validate().toRawObject(),
    });

  if (trialSessionEntity.judge && trialSessionEntity.judge.userId) {
    const trialSessionWorkingCopyEntity = new TrialSessionWorkingCopy({
      trialSessionId: trialSessionEntity.trialSessionId,
      userId: trialSessionEntity.judge.userId,
    });

    await applicationContext
      .getPersistenceGateway()
      .createTrialSessionWorkingCopy({
        applicationContext,
        trialSessionWorkingCopy: trialSessionWorkingCopyEntity
          .validate()
          .toRawObject(),
      });
  }

  return createdTrialSession;
};
