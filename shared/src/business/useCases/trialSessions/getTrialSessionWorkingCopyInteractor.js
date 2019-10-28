const { User } = require('../../entities/User');
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

  let judgeUserId;
  if (user.role === User.ROLES.judge) {
    judgeUserId = user.userId;
  } else if (user.role === User.ROLES.chambers) {
    // TODO: Currently getCurrentUser does not return the user's section
    const chambersUser = await applicationContext
      .getUseCases()
      .getUserInteractor({ applicationContext });

    const sectionUsers = await applicationContext
      .getUseCases()
      .getUsersInSectionInteractor({
        applicationContext,
        section: chambersUser.section,
      });

    const sectionJudge = sectionUsers.find(
      user => user.role === User.ROLES.judge,
    );
    judgeUserId = sectionJudge.userId;
  }

  const trialSessionWorkingCopy = await applicationContext
    .getPersistenceGateway()
    .getTrialSessionWorkingCopy({
      applicationContext,
      trialSessionId,
      userId: judgeUserId,
    });

  if (trialSessionWorkingCopy) {
    const trialSessionWorkingCopyEntity = new TrialSessionWorkingCopy(
      trialSessionWorkingCopy,
    ).validate();
    return trialSessionWorkingCopyEntity.toRawObject();
  }
};
