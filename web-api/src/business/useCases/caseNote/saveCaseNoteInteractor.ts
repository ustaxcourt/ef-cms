import { Case } from '@shared/business/entities/cases/Case';
import {
  ROLE_PERMISSIONS,
  isAuthorized,
} from '@shared/authorization/authorizationClientService';
import { ServerApplicationContext } from '@web-api/applicationContext';
import { UnauthorizedError } from '@web-api/errors/errors';
import { UnknownAuthUser } from '@shared/business/entities/authUser/AuthUser';
import { getCaseByDocketNumber } from '@web-api/persistence/postgres/cases/getCaseByDocketNumber';
import { withLocking } from '@web-api/persistence/postgres/utils/mutex';

/**
 * saveCaseNote
 *
 * @param {object} applicationContext the application context
 * @param {object} providers the providers object
 * @param {string} providers.docketNumber the docket number of the case to update case note
 * @param {string} providers.caseNote the note to update
 * @returns {object} the updated case note returned from persistence
 */
export const saveCaseNote = async (
  applicationContext: ServerApplicationContext,
  { caseNote, docketNumber }: { caseNote: string; docketNumber: string },
  authorizedUser: UnknownAuthUser,
) => {
  if (!isAuthorized(authorizedUser, ROLE_PERMISSIONS.CASE_NOTES)) {
    throw new UnauthorizedError('Unauthorized');
  }

  const caseRecord = await getCaseByDocketNumber({
    applicationContext,
    docketNumber,
  });

  const caseToUpdate = new Case(
    { ...caseRecord, caseNote },
    {
      authorizedUser,
    },
  )
    .validate()
    .toRawObject();

  const result = await applicationContext
    .getUseCaseHelpers()
    .updateCaseAndAssociations({
      applicationContext,
      authorizedUser,
      caseToUpdate,
    });

  return new Case(result, { authorizedUser }).validate().toRawObject();
};

export const saveCaseNoteInteractor = withLocking(
  saveCaseNote,
  (_applicationContext, { docketNumber }) => ({
    identifiers: [`case|${docketNumber}`],
  }),
);
