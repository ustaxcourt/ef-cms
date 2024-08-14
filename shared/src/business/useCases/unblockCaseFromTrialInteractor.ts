import { Case } from '../entities/cases/Case';
import {
  ROLE_PERMISSIONS,
  isAuthorized,
} from '../../authorization/authorizationClientService';
import { ServerApplicationContext } from '@web-api/applicationContext';
import { UnauthorizedError } from '@web-api/errors/errors';
import { UnknownAuthUser } from '@shared/business/entities/authUser/AuthUser';
import { withLocking } from '@web-api/business/useCaseHelper/acquireLock';

/**
 * used for unblocking a case
 * @param {object} applicationContext the application context
 * @param {object} providers the providers object
 * @param {string} providers.docketNumber the docket number to unblock
 * @returns {object} the case data
 */
export const unblockCaseFromTrial = async (
  applicationContext: ServerApplicationContext,
  { docketNumber }: { docketNumber: string },
  authorizedUser: UnknownAuthUser,
) => {
  if (!isAuthorized(authorizedUser, ROLE_PERMISSIONS.BLOCK_CASE)) {
    throw new UnauthorizedError('Unauthorized');
  }

  const caseToUpdate = await applicationContext
    .getPersistenceGateway()
    .getCaseByDocketNumber({
      applicationContext,
      docketNumber,
    });

  const caseEntity = new Case(caseToUpdate, { authorizedUser });

  caseEntity.unsetAsBlocked();

  if (caseEntity.isReadyForTrial()) {
    await applicationContext
      .getPersistenceGateway()
      .createCaseTrialSortMappingRecords({
        applicationContext,
        caseSortTags: caseEntity.generateTrialSortTags(),
        docketNumber: caseEntity.docketNumber,
      });
  }

  const updatedCase = await applicationContext
    .getUseCaseHelpers()
    .updateCaseAndAssociations({
      applicationContext,
      authorizedUser,
      caseToUpdate: caseEntity,
    });

  return new Case(updatedCase, { authorizedUser }).validate().toRawObject();
};

export const unblockCaseFromTrialInteractor = withLocking(
  unblockCaseFromTrial,
  (_applicationContext, { docketNumber }) => ({
    identifiers: [`case|${docketNumber}`],
  }),
);
