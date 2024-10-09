import {
  ROLE_PERMISSIONS,
  isAuthorized,
} from '../../../../../shared/src/authorization/authorizationClientService';
import { ServerApplicationContext } from '@web-api/applicationContext';
import { UnauthorizedError } from '@web-api/errors/errors';
import { UnknownAuthUser } from '@shared/business/entities/authUser/AuthUser';
import { UserCaseNote } from '../../../../../shared/src/business/entities/notes/UserCaseNote';
import { getUserCaseNote } from '@web-api/persistence/postgres/userCaseNotes/getUserCaseNote';

/**
 * getUserCaseNoteInteractor
 *
 * @param {object} applicationContext the application context
 * @param {object} providers the providers object
 * @param {string} providers.docketNumber the docket number of the case to get notes for
 * @returns {object} the case note object if one is found
 */
export const getUserCaseNoteInteractor = async (
  applicationContext: ServerApplicationContext,
  { docketNumber }: { docketNumber: string },
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

  const caseNote = await getUserCaseNote({
    docketNumber,
    userId,
  });

  if (caseNote) {
    return new UserCaseNote(caseNote).validate().toRawObject();
  }
};
