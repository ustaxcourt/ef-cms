const {
  isAuthorized,
  TRIAL_SESSIONS,
} = require('../../../authorization/authorizationClientService');
const {
  TrialSessionWorkingCopy,
} = require('../../entities/trialSessions/TrialSessionWorkingCopy');
const { NotFoundError, UnauthorizedError } = require('../../../errors/errors');

/**
 * getTrialSessionWorkingCopyInteractor
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @returns {Array<TrialSession>} the trial session working copy returned from persistence
 */
exports.getTrialSessionWorkingCopyInteractor = async ({
  applicationContext,
  trialSessionId,
}) => {
  const user = applicationContext.getCurrentUser();
  if (!isAuthorized(user, TRIAL_SESSIONS)) {
    throw new UnauthorizedError('Unauthorized');
  }

  const trialSessionWorkingCopy = await applicationContext
    .getPersistenceGateway()
    .getTrialSessionWorkingCopy({
      applicationContext,
      trialSessionId,
      userId: user.userId,
    });

  if (!trialSessionWorkingCopy) {
    throw new NotFoundError(
      `Working copy for trial session ${trialSessionId} was not found.`,
    );
  }

  const trialSessionWorkingCopyEntity = new TrialSessionWorkingCopy(
    trialSessionWorkingCopy,
  ).validate();
  return trialSessionWorkingCopyEntity.toRawObject();
};
