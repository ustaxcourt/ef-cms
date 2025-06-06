import { Case } from '@shared/business/entities/cases/Case';
import { CaseFactory } from '@shared/business/entities/cases/CaseFactory';
import { NotFoundError, UnauthorizedError } from '@web-api/errors/errors';
import {
  ROLE_PERMISSIONS,
  isAuthorized,
} from '@shared/authorization/authorizationClientService';
import { ServerApplicationContext } from '@web-api/applicationContext';
import { UnknownAuthUser } from '@shared/business/entities/authUser/AuthUser';
import { getCaseByDocketNumber } from '@web-api/persistence/postgres/cases/getCaseByDocketNumber';
import { withLocking } from '@web-api/business/useCaseHelper/acquireLock';
import { updateCaseAndAssociations } from '@web-api/business/useCaseHelper/caseAssociation/updateCaseAndAssociations';

/**
 * unsealCase
 * @param {object} applicationContext the application context
 * @param {object} providers the providers object
 * @param {string} providers.docketNumber the docket number of the case to update
 * @returns {Promise<object>} the updated case data
 */
export const unsealCase = async (
  _applicationContext: ServerApplicationContext,
  { docketNumber }: { docketNumber: string },
  authorizedUser: UnknownAuthUser,
) => {
  if (!isAuthorized(authorizedUser, ROLE_PERMISSIONS.UNSEAL_CASE)) {
    throw new UnauthorizedError('Unauthorized for unsealing cases');
  }

  const rawCaseToUpdate = await getCaseByDocketNumber({
    docketNumber,
  });

  if (!rawCaseToUpdate) {
    throw new NotFoundError(`Case ${docketNumber} was not found.`);
  }

  const caseToUpdate = new Case(rawCaseToUpdate, { authorizedUser });

  caseToUpdate.setAsUnsealed();

  const updatedCase = await updateCaseAndAssociations({
    authorizedUser,
    caseToUpdate,
  });

  return CaseFactory.getFullCase({ rawCase: updatedCase, user: authorizedUser })
    .validate()
    .toRawObject();
};

export const unsealCaseInteractor = withLocking(
  unsealCase,
  (_applicationContext, { docketNumber }) => ({
    identifiers: [`case|${docketNumber}`],
  }),
);
