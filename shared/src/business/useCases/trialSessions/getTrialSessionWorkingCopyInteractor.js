const {
  isAuthorized,
  ROLE_PERMISSIONS,
} = require('../../../authorization/authorizationClientService');
const {
  TrialSessionWorkingCopy,
} = require('../../entities/trialSessions/TrialSessionWorkingCopy');
const { NotFoundError, UnauthorizedError } = require('../../../errors/errors');
const { TrialSession } = require('../../entities/trialSessions/TrialSession');

/**
 * getTrialSessionWorkingCopyInteractor
 *
 * @param {object} applicationContext the application context
 * @param {object} providers the providers object
 * @param {string} providers.trialSessionId id of the trial session
 * @returns {TrialSessionWorkingCopy} the trial session working copy returned from persistence
 */
exports.getTrialSessionWorkingCopyInteractor = async (
  applicationContext,
  { trialSessionId },
) => {
  const user = applicationContext.getCurrentUser();
  if (!isAuthorized(user, ROLE_PERMISSIONS.TRIAL_SESSION_WORKING_COPY)) {
    throw new UnauthorizedError('Unauthorized');
  }

  const judgeUser = await applicationContext
    .getUseCases()
    .getJudgeForUserChambersInteractor(applicationContext, { user });

  const chambersUserId = (judgeUser && judgeUser.userId) || user.userId;

  let trialSessionWorkingCopyEntity, validRawTrialSessionWorkingCopyEntity;

  const trialSessionWorkingCopy = await applicationContext
    .getPersistenceGateway()
    .getTrialSessionWorkingCopy({
      applicationContext,
      trialSessionId,
      userId: chambersUserId,
    });

  if (trialSessionWorkingCopy) {
    trialSessionWorkingCopyEntity = new TrialSessionWorkingCopy(
      trialSessionWorkingCopy,
    );
    validRawTrialSessionWorkingCopyEntity = trialSessionWorkingCopyEntity
      .validate()
      .toRawObject();
  } else {
    const trialSessionDetails = await applicationContext
      .getPersistenceGateway()
      .getTrialSessionById({
        applicationContext,
        trialSessionId,
      });
    const trialSessionEntity = new TrialSession(trialSessionDetails, {
      applicationContext,
    });

    const canCreateWorkingCopy =
      (trialSessionEntity.trialClerk &&
        trialSessionEntity.trialClerk.userId === chambersUserId) ||
      (judgeUser &&
        trialSessionEntity.judge &&
        judgeUser.userId === trialSessionEntity.judge.userId);

    if (canCreateWorkingCopy) {
      trialSessionWorkingCopyEntity = new TrialSessionWorkingCopy({
        trialSessionId,
        userId: chambersUserId,
      });
      validRawTrialSessionWorkingCopyEntity = trialSessionWorkingCopyEntity
        .validate()
        .toRawObject();
      await applicationContext
        .getPersistenceGateway()
        .createTrialSessionWorkingCopy({
          applicationContext,
          trialSessionWorkingCopy: validRawTrialSessionWorkingCopyEntity,
        });
    } else {
      throw new NotFoundError('Trial session working copy not found');
    }
  }
  return validRawTrialSessionWorkingCopyEntity;
};
