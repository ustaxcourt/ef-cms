import {
  ROLE_PERMISSIONS,
  isAuthorized,
} from '../../../authorization/authorizationClientService';
import { UnauthorizedError } from '@web-api/errors/errors';
import { UserCaseNote } from '../../entities/notes/UserCaseNote';

/**
 * getUserCaseNoteInteractor
 *
 * @param {object} applicationContext the application context
 * @param {object} providers the providers object
 * @param {string} providers.docketNumber the docket number of the case to get notes for
 * @returns {object} the case note object if one is found
 */
export const getUserCaseNoteInteractor = async (
  applicationContext: IApplicationContext,
  { docketNumber }: { docketNumber: string },
) => {
  const user = applicationContext.getCurrentUser();

  if (!isAuthorized(user, ROLE_PERMISSIONS.TRIAL_SESSION_WORKING_COPY)) {
    throw new UnauthorizedError('Unauthorized');
  }

  const userId = await applicationContext
    .getUseCaseHelpers()
    .getUserIdForNote(applicationContext, {
      userIdMakingRequest: user.userId,
    });

  const caseNote = await applicationContext
    .getPersistenceGateway()
    .getUserCaseNote({
      applicationContext,
      docketNumber,
      userId,
    });

  if (caseNote) {
    return new UserCaseNote(caseNote).validate().toRawObject();
  }
};
