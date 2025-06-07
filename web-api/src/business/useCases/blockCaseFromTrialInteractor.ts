import { Case } from '@shared/business/entities/cases/Case';
import {
  ROLE_PERMISSIONS,
  isAuthorized,
} from '@shared/authorization/authorizationClientService';
import {
  applicationContext,
  ServerApplicationContext,
} from '@web-api/applicationContext';
import { UnauthorizedError } from '@web-api/errors/errors';
import { UnknownAuthUser } from '@shared/business/entities/authUser/AuthUser';
import { getCaseByDocketNumber } from '@web-api/persistence/postgres/cases/getCaseByDocketNumber';
import { withLocking } from '@web-api/business/useCaseHelper/acquireLock';
import { updateCaseAndAssociations } from '@web-api/business/useCaseHelper/caseAssociation/updateCaseAndAssociations';

/**
 * used for setting a case as blocked
 * @param {object} applicationContext the application context
 * @param {object} providers the providers object
 * @param {string} providers.reason the reason the case is being blocked
 * @param {string} providers.docketNumber the docket number to block
 * @returns {object} the case data
 */
export const blockCaseFromTrial = async (
  _applicationContext: ServerApplicationContext,
  { docketNumber, reason }: { docketNumber: string; reason: string },
  authorizedUser: UnknownAuthUser,
) => {
  if (!isAuthorized(authorizedUser, ROLE_PERMISSIONS.BLOCK_CASE)) {
    throw new UnauthorizedError('Unauthorized');
  }

  const caseToUpdate = await getCaseByDocketNumber({
    applicationContext,
    docketNumber,
  });

  const caseEntity = new Case(caseToUpdate, { authorizedUser });

  caseEntity.setAsBlocked(reason);

  const updatedCase = await updateCaseAndAssociations({
    applicationContext,
    authorizedUser,
    caseToUpdate: caseEntity,
  });

  return new Case(updatedCase, { authorizedUser }).validate().toRawObject();
};

export const blockCaseFromTrialInteractor = withLocking(
  blockCaseFromTrial,
  (_applicationContext, { docketNumber }) => ({
    identifiers: [`case|${docketNumber}`],
  }),
);
