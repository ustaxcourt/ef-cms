import {
  ROLE_PERMISSIONS,
  isAuthorized,
} from '../../../../../shared/src/authorization/authorizationClientService';
import { ServerApplicationContext } from '@web-api/applicationContext';
import { UnauthorizedError } from '@web-api/errors/errors';
import { UnknownAuthUser } from '@shared/business/entities/authUser/AuthUser';
import { deleteUserCaseNote } from '@web-api/persistence/postgres/userCaseNotes/deleteUserCaseNote';

/**
 * deleteUserCaseNoteInteractor
 *
 * @param {object} applicationContext the application context
 * @param {object} providers the providers object
 * @param {string} providers.docketNumber the docket number of the case the case note is attached to
 * @returns {Promise} the promise of the delete call
 */
export const deleteUserCaseNoteInteractor = async (
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

  return await deleteUserCaseNote({
    docketNumber,
    userId,
  });
};
