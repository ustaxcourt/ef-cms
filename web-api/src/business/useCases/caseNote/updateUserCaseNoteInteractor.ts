import {
  ROLE_PERMISSIONS,
  isAuthorized,
} from '../../../../../shared/src/authorization/authorizationClientService';
import { UnauthorizedError } from '@web-api/errors/errors';
import { UnknownAuthUser } from '@shared/business/entities/authUser/AuthUser';
import { UserCaseNote } from '../../../../../shared/src/business/entities/notes/UserCaseNote';
import { upsertUserCaseNote } from '@web-api/persistence/postgres/userCaseNotes/upsertUserCaseNote';

export const updateUserCaseNoteInteractor = async (
  applicationContext,
  { docketNumber, notes }: { docketNumber: string; notes: string },
  authorizedUser: UnknownAuthUser,
) => {
  if (
    !isAuthorized(authorizedUser, ROLE_PERMISSIONS.TRIAL_SESSION_WORKING_COPY)
  ) {
    throw new UnauthorizedError('Unauthorized');
  }

  const userId = await applicationContext
    .getUseCaseHelpers()
    .getUserIdForNote(applicationContext, {
      userIdMakingRequest: authorizedUser.userId,
    });

  const caseNoteEntity = new UserCaseNote({
    docketNumber,
    notes,
    userId,
  }).validate();

  await upsertUserCaseNote({
    caseNoteToUpsert: caseNoteEntity,
  });

  return caseNoteEntity;
};
