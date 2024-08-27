import {
  ROLE_PERMISSIONS,
  isAuthorized,
} from '../../../../../shared/src/authorization/authorizationClientService';
import {
  RawTrialSessionWorkingCopy,
  TrialSessionWorkingCopy,
} from '../../../../../shared/src/business/entities/trialSessions/TrialSessionWorkingCopy';
import { ServerApplicationContext } from '@web-api/applicationContext';
import { UnauthorizedError } from '@web-api/errors/errors';
import { UnknownAuthUser } from '@shared/business/entities/authUser/AuthUser';

/**
 * updateTrialSessionWorkingCopyInteractor
 *
 * @param {object} applicationContext the application context
 * @param {object} providers the providers object
 * @param {object} providers.trialSessionWorkingCopyToUpdate the trial session working copy data to update
 * @returns {TrialSessionWorkingCopy} the updated trial session working copy returned from persistence
 */
export const updateTrialSessionWorkingCopyInteractor = async (
  applicationContext: ServerApplicationContext,
  {
    trialSessionWorkingCopyToUpdate,
  }: { trialSessionWorkingCopyToUpdate: RawTrialSessionWorkingCopy },
  authorizedUser: UnknownAuthUser,
) => {
  if (
    !isAuthorized(authorizedUser, ROLE_PERMISSIONS.TRIAL_SESSION_WORKING_COPY)
  ) {
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
