const {
  isAuthorized,
  ROLE_PERMISSIONS,
} = require('../../../authorization/authorizationClientService');
const {
  TrialSessionWorkingCopy,
} = require('../../entities/trialSessions/TrialSessionWorkingCopy');
const { UnauthorizedError } = require('../../../errors/errors');

/**
 * getTrialSessionWorkingCopyInteractor
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {string} providers.trialSessionId id of the trial session
 * @returns {TrialSessionWorkingCopy} the trial session working copy returned from persistence
 */
exports.getTrialSessionWorkingCopyInteractor = async ({
  applicationContext,
  trialSessionId,
}) => {
  const user = applicationContext.getCurrentUser();
  if (!isAuthorized(user, ROLE_PERMISSIONS.TRIAL_SESSION_WORKING_COPY)) {
    throw new UnauthorizedError('Unauthorized');
  }

  const judgeUser = await applicationContext
    .getUseCases()
    .getJudgeForUserChambersInteractor({ applicationContext, user });

  const trialSessionWorkingCopy = await applicationContext
    .getPersistenceGateway()
    .getTrialSessionWorkingCopy({
      applicationContext,
      trialSessionId,
      userId: judgeUser.userId,
    });

  if (trialSessionWorkingCopy) {
    const trialSessionWorkingCopyEntity = new TrialSessionWorkingCopy(
      trialSessionWorkingCopy,
    ).validate();
    return trialSessionWorkingCopyEntity.toRawObject();
  }
};
