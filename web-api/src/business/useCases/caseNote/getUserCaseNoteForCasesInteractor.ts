import {
  ROLE_PERMISSIONS,
  isAuthorized,
} from '@shared/authorization/authorizationClientService';
import { UnauthorizedError } from '@web-api/errors/errors';
import { UnknownAuthUser } from '@shared/business/entities/authUser/AuthUser';
import { getUserCaseNotes } from '@web-api/persistence/postgres/userCaseNotes/getUserCaseNotes';

export const getUserCaseNoteForCasesInteractor = async (
  applicationContext,
  { docketNumbers }: { docketNumbers: string[] },
  authorizedUser: UnknownAuthUser,
) => {
  if (!isAuthorized(authorizedUser, ROLE_PERMISSIONS.TRIAL_SESSIONS)) {
    throw new UnauthorizedError('Unauthorized');
  }

  const userId = await applicationContext
    .getUseCaseHelpers()
    .getUserIdForNote(applicationContext, {
      userIdMakingRequest: authorizedUser.userId,
    });

  const caseNotes = await getUserCaseNotes({
    docketNumbers,
    userId,
  });

  return caseNotes.map(note => note.validate().toRawObject());
};
