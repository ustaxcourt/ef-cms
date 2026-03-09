import {
  ROLE_PERMISSIONS,
  isAuthorized,
} from '@shared/authorization/authorizationClientService';
import { ServerApplicationContext } from '@web-api/applicationContext';
import { UnauthorizedError } from '@web-api/errors/errors';
import { UnknownAuthUser } from '@shared/business/entities/authUser/AuthUser';
import { getCaseByDocketNumber } from '@web-api/persistence/postgres/cases/getCaseByDocketNumber';
import { updateCaseAndAssociations } from '@web-api/business/useCaseHelper/caseAssociation/updateCaseAndAssociations';
import { withLocking } from '@web-api/persistence/postgres/utils/mutex';

export const deleteCaseNote = async (
  _applicationContext: ServerApplicationContext,
  { docketNumber }: { docketNumber: string },
  authorizedUser: UnknownAuthUser,
): Promise<void> => {
  if (!isAuthorized(authorizedUser, ROLE_PERMISSIONS.CASE_NOTES)) {
    throw new UnauthorizedError('Unauthorized');
  }

  const caseRecord = await getCaseByDocketNumber({
    docketNumber,
  });

  delete caseRecord.caseNote;

  await updateCaseAndAssociations({
    authorizedUser,
    caseToUpdate: caseRecord,
  });
};

export const deleteCaseNoteInteractor = withLocking(
  deleteCaseNote,
  (_applicationContext, { docketNumber }) => ({
    identifiers: [`case|${docketNumber}`],
  }),
);
