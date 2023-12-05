import {
  ROLE_PERMISSIONS,
  isAuthorized,
} from '../../../authorization/authorizationClientService';
import {
  RawTrialSessionWorkingCopy,
  TrialSessionWorkingCopy,
} from '../../entities/trialSessions/TrialSessionWorkingCopy';
import { UnauthorizedError } from '@web-api/errors/errors';

/**
 * updateTrialSessionWorkingCopyInteractor
 *
 * @param {object} applicationContext the application context
 * @param {object} providers the providers object
 * @param {object} providers.trialSessionWorkingCopyToUpdate the trial session working copy data to update
 * @returns {TrialSessionWorkingCopy} the updated trial session working copy returned from persistence
 */
export const updateTrialSessionWorkingCopyInteractor = async (
  applicationContext: IApplicationContext,
  {
    trialSessionWorkingCopyToUpdate,
  }: { trialSessionWorkingCopyToUpdate: RawTrialSessionWorkingCopy },
) => {
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
