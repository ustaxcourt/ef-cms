import {
  ROLE_PERMISSIONS,
  isAuthorized,
} from '../../../../../shared/src/authorization/authorizationClientService';
import { UnauthorizedError } from '@web-api/errors/errors';
import { UnknownAuthUser } from '@shared/business/entities/authUser/AuthUser';
import { getUserCaseNoteForCases } from '@web-api/persistence/postgres/userCaseNotes/getUserCaseNoteForCases';

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

  const caseNotes = await getUserCaseNoteForCases({
    docketNumbers,
    userId,
  });

  return caseNotes.map(note => note.validate().toRawObject());
};
