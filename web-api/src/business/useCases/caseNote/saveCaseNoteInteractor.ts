import {
  ROLE_PERMISSIONS,
  isAuthorized,
} from '@shared/authorization/authorizationClientService';
import { ServerApplicationContext } from '@web-api/applicationContext';
import { UnauthorizedError } from '@web-api/errors/errors';
import { UnknownAuthUser } from '@shared/business/entities/authUser/AuthUser';
import { updateCaseNote } from '@web-api/persistence/postgres/cases/updateCaseNote';

export const saveCaseNoteInteractor = async (
  _applicationContext: ServerApplicationContext,
  { caseNote, docketNumber }: { caseNote: string; docketNumber: string },
  authorizedUser: UnknownAuthUser,
): Promise<void> => {
  if (!isAuthorized(authorizedUser, ROLE_PERMISSIONS.CASE_NOTES)) {
    throw new UnauthorizedError('Unauthorized');
  }

  await updateCaseNote({
    caseNote,
    docketNumber,
  });
};
