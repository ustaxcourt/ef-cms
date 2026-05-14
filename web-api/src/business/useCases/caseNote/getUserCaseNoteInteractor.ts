import {
  ROLE_PERMISSIONS,
  isAuthorized,
} from '@shared/authorization/authorizationClientService';
import { ServerApplicationContext } from '@web-api/applicationContext';
import { UnauthorizedError } from '@web-api/errors/errors';
import { UnknownAuthUser } from '@shared/business/entities/authUser/AuthUser';
import { getUserCaseNotes } from '@web-api/persistence/postgres/userCaseNotes/getUserCaseNotes';
import { UserCaseNote } from '@shared/business/entities/notes/UserCaseNote';

export const getUserCaseNoteInteractor = async (
  applicationContext: ServerApplicationContext,
  { docketNumber }: { docketNumber: string },
  authorizedUser: UnknownAuthUser,
): Promise<UserCaseNote | undefined> => {
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

  const caseNotes = await getUserCaseNotes({
    docketNumbers: [docketNumber],
    userId,
  });

  if (caseNotes?.length) {
    return caseNotes[0].validate();
  }
};
