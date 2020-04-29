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

  const oldWorkingCopy = await applicationContext
    .getPersistenceGateway()
    .getTrialSessionWorkingCopy({
      applicationContext,
      trialSessionId: trialSessionWorkingCopyToUpdate.trialSessionId,
      userId: trialSessionWorkingCopyToUpdate.userId,
    });

  const editableFields = {
    caseMetadata: trialSessionWorkingCopyToUpdate.caseMetadata,
    filters: trialSessionWorkingCopyToUpdate.filters,
    sessionNotes: trialSessionWorkingCopyToUpdate.sessionNotes,
    sort: trialSessionWorkingCopyToUpdate.sort,
    sortOrder: trialSessionWorkingCopyToUpdate.sortOrder,
  };

  const updatedTrialSessionWorkingCopy = new TrialSessionWorkingCopy({
    ...oldWorkingCopy,
    ...editableFields,
  })
    .validate()
    .toRawObject();

  await applicationContext
    .getPersistenceGateway()
    .updateTrialSessionWorkingCopy({
      applicationContext,
      trialSessionWorkingCopyToUpdate: updatedTrialSessionWorkingCopy,
    });

  return updatedTrialSessionWorkingCopy;
};
