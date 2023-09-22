import { Case } from '../entities/cases/Case';
import {
  ROLE_PERMISSIONS,
  isAuthorized,
} from '../../authorization/authorizationClientService';
import { UnauthorizedError } from '../../../../web-api/src/errors/errors';

/**
 * removeCasePendingItemInteractor
 *
 * @param {object} applicationContext the application context
 * @param {object} providers the providers object
 * @param {string} providers.docketNumber the docket number of the case to update
 * @param {object} providers.docketEntryId the id of the docket entry no longer pending
 * @returns {object} the updated case data
 */
export const removeCasePendingItemInteractor = async (
  applicationContext,
  { docketEntryId, docketNumber },
) => {
  const user = applicationContext.getCurrentUser();

  if (!isAuthorized(user, ROLE_PERMISSIONS.UPDATE_CASE)) {
    throw new UnauthorizedError('Unauthorized for update case');
  }

  const caseToUpdate = await applicationContext
    .getPersistenceGateway()
    .getCaseByDocketNumber({ applicationContext, docketNumber });

  caseToUpdate.docketEntries.forEach(docketEntry => {
    if (docketEntry.docketEntryId === docketEntryId) {
      docketEntry.pending = false;
    }
  });

  let updatedCaseEntity = new Case(caseToUpdate, { applicationContext });

  updatedCaseEntity = await applicationContext
    .getUseCaseHelpers()
    .updateCaseAutomaticBlock({
      applicationContext,
      caseEntity: updatedCaseEntity,
    });

  await applicationContext.getUseCaseHelpers().updateCaseAndAssociations({
    applicationContext,
    caseToUpdate: updatedCaseEntity,
  });

  return updatedCaseEntity.toRawObject();
};
