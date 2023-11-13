import {
  ROLE_PERMISSIONS,
  isAuthorized,
} from '../../../authorization/authorizationClientService';
import { UnauthorizedError } from '@web-api/errors/errors';
import { UserCaseNote } from '../../entities/notes/UserCaseNote';

/**
 * updateUserCaseNoteInteractor
 *
 * @param {object} applicationContext the application context
 * @param {object} providers the providers object
 * @param {string} providers.docketNumber the docket number of the case to update notes
 * @param {string} providers.notes the notes to update
 * @returns {object} the updated case note returned from persistence
 */
export const updateUserCaseNoteInteractor = async (
  applicationContext,
  { docketNumber, notes }: { docketNumber: string; notes: string },
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

  const caseNoteEntity = new UserCaseNote({
    docketNumber,
    notes,
    userId,
  });

  const caseNoteToUpdate = caseNoteEntity.validate().toRawObject();

  await applicationContext.getPersistenceGateway().updateUserCaseNote({
    applicationContext,
    caseNoteToUpdate,
  });

  return caseNoteToUpdate;
};
