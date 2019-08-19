const {
  isAuthorized,
  TRIAL_SESSION_WORKING_COPY,
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
  if (!isAuthorized(user, TRIAL_SESSION_WORKING_COPY)) {
    throw new UnauthorizedError('Unauthorized');
  }

  const trialSessionWorkingCopy = await applicationContext
    .getPersistenceGateway()
    .getTrialSessionWorkingCopy({
      applicationContext,
      trialSessionId,
      userId: user.userId,
    });

  if (trialSessionWorkingCopy) {
    const trialSessionWorkingCopyEntity = new TrialSessionWorkingCopy(
      trialSessionWorkingCopy,
    ).validate();
    return trialSessionWorkingCopyEntity.toRawObject();
  }
};
