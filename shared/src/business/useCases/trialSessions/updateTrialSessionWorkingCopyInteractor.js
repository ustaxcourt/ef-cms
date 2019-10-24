const {
  isAuthorized,
  ROLE_PERMISSIONS,
} = require('../../../authorization/authorizationClientService');
const {
  TrialSessionWorkingCopy,
} = require('../../entities/trialSessions/TrialSessionWorkingCopy');
const { UnauthorizedError } = require('../../../errors/errors');

/**
 * updateTrialSessionWorkingCopyInteractor
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {object} providers.trialSessionWorkingCopyToUpdate the trial session working copy data to update
 * @returns {TrialSessionWorkingCopy} the updated trial session working copy returned from persistence
 */
exports.updateTrialSessionWorkingCopyInteractor = async ({
  applicationContext,
  trialSessionWorkingCopyToUpdate,
}) => {
  const user = applicationContext.getCurrentUser();
  if (!isAuthorized(user, ROLE_PERMISSIONS.TRIAL_SESSION_WORKING_COPY)) {
    throw new UnauthorizedError('Unauthorized');
  }

  const updatedTrialSessionWorkingCopy = await applicationContext
    .getPersistenceGateway()
    .updateTrialSessionWorkingCopy({
      applicationContext,
      trialSessionWorkingCopyToUpdate,
    });

  const trialSessionWorkingCopyEntity = new TrialSessionWorkingCopy(
    updatedTrialSessionWorkingCopy,
  ).validate();
  return trialSessionWorkingCopyEntity.toRawObject();
};
