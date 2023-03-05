import { Case } from '../entities/cases/Case';
import {
  ROLE_PERMISSIONS,
  isAuthorized,
} from '../../authorization/authorizationClientService';
import { UnauthorizedError } from '../../errors/errors';

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

  const caseRecord = await applicationContext
    .getPersistenceGateway()
    .getCaseByDocketNumber({ applicationContext, docketNumber });
  const oldCaseCopy = applicationContext
    .getUtilities()
    .cloneAndFreeze(caseRecord);
  let updatedCaseEntity = new Case(caseRecord, { applicationContext });

  updatedCaseEntity.docketEntries.forEach(docketEntry => {
    if (docketEntry.docketEntryId === docketEntryId) {
      docketEntry.pending = false;
    }
  });

  updatedCaseEntity = await applicationContext
    .getUseCaseHelpers()
    .updateCaseAutomaticBlock({
      applicationContext,
      caseEntity: updatedCaseEntity,
    });

  await applicationContext.getUseCaseHelpers().updateCaseAndAssociations({
    applicationContext,
    newCase: updatedCaseEntity,
    oldCaseCopy,
  });

  return updatedCaseEntity.toRawObject();
};
