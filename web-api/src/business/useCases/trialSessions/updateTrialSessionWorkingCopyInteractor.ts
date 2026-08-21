import {
  ROLE_PERMISSIONS,
  isAuthorized,
} from '@shared/authorization/authorizationClientService';
import {
  RawTrialSessionWorkingCopy,
  TrialSessionWorkingCopy,
} from '@shared/business/entities/trialSessions/TrialSessionWorkingCopy';
import { UnauthorizedError } from '@web-api/errors/errors';
import { UnknownAuthUser } from '@shared/business/entities/authUser/AuthUser';
import { getTrialSessionWorkingCopies } from '@web-api/persistence/postgres/trialSessions/getTrialSessionWorkingCopies';
import { upsertTrialSessionWorkingCopy } from '@web-api/persistence/postgres/trialSessions/upsertTrialSessionWorkingCopy';

export const updateTrialSessionWorkingCopyInteractor = async (
  {
    trialSessionWorkingCopyToUpdate,
  }: { trialSessionWorkingCopyToUpdate: RawTrialSessionWorkingCopy },
  authorizedUser: UnknownAuthUser,
): Promise<RawTrialSessionWorkingCopy> => {
  if (
    !isAuthorized(authorizedUser, ROLE_PERMISSIONS.TRIAL_SESSION_WORKING_COPY)
  ) {
    throw new UnauthorizedError('Unauthorized');
  }

  const oldWorkingCopy = (
    await getTrialSessionWorkingCopies({
      tsWorkingCopyIds: [
        {
          trialSessionId: trialSessionWorkingCopyToUpdate.trialSessionId,
          userId: trialSessionWorkingCopyToUpdate.userId,
        },
      ],
    })
  ).at(0);

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

  await upsertTrialSessionWorkingCopy({
    trialSessionWorkingCopyToUpdate: updatedTrialSessionWorkingCopy,
  });

  return updatedTrialSessionWorkingCopy;
};
