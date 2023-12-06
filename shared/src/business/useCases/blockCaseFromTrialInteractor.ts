import { Case } from '../entities/cases/Case';
import {
  ROLE_PERMISSIONS,
  isAuthorized,
} from '../../authorization/authorizationClientService';
import { UnauthorizedError } from '@web-api/errors/errors';
import { withLocking } from '@shared/business/useCaseHelper/acquireLock';

/**
 * used for setting a case as blocked
 * @param {object} applicationContext the application context
 * @param {object} providers the providers object
 * @param {string} providers.reason the reason the case is being blocked
 * @param {string} providers.docketNumber the docket number to block
 * @returns {object} the case data
 */
export const blockCaseFromTrial = async (
  applicationContext: IApplicationContext,
  { docketNumber, reason }: { docketNumber: string; reason: string },
) => {
  const authorizedUser = applicationContext.getCurrentUser();

  if (!isAuthorized(authorizedUser, ROLE_PERMISSIONS.BLOCK_CASE)) {
    throw new UnauthorizedError('Unauthorized');
  }

  const caseToUpdate = await applicationContext
    .getPersistenceGateway()
    .getCaseByDocketNumber({
      applicationContext,
      docketNumber,
    });

  const caseEntity = new Case(caseToUpdate, { applicationContext });

  caseEntity.setAsBlocked(reason);

  await applicationContext
    .getPersistenceGateway()
    .deleteCaseTrialSortMappingRecords({
      applicationContext,
      docketNumber: caseEntity.docketNumber,
    });

  const updatedCase = await applicationContext
    .getUseCaseHelpers()
    .updateCaseAndAssociations({
      applicationContext,
      caseToUpdate: caseEntity,
    });

  return new Case(updatedCase, { applicationContext }).validate().toRawObject();
};

export const blockCaseFromTrialInteractor = withLocking(
  blockCaseFromTrial,
  (_applicationContext, { docketNumber }) => ({
    identifiers: [`case|${docketNumber}`],
  }),
);
