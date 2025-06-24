import { Case } from '@shared/business/entities/cases/Case';
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

/**
 * removeCasePendingItem
 * @param {object} applicationContext the application context
 * @param {object} providers the providers object
 * @param {string} providers.docketNumber the docket number of the case to update
 * @param {object} providers.docketEntryId the id of the docket entry no longer pending
 * @returns {object} the updated case data
 */
export const removeCasePendingItem = async (
  applicationContext: ServerApplicationContext,
  { docketEntryId, docketNumber },
  authorizedUser: UnknownAuthUser,
) => {
  if (!isAuthorized(authorizedUser, ROLE_PERMISSIONS.UPDATE_CASE)) {
    throw new UnauthorizedError('Unauthorized for update case');
  }

  const caseToUpdate = await getCaseByDocketNumber({
    docketNumber,
  });

  caseToUpdate.docketEntries.forEach(docketEntry => {
    if (docketEntry.docketEntryId === docketEntryId) {
      docketEntry.pending = false;
    }
  });

  let updatedCaseEntity = new Case(caseToUpdate, {
    authorizedUser,
  });

  updatedCaseEntity = await applicationContext
    .getUseCaseHelpers()
    .updateCaseAutomaticBlock({
      caseEntity: updatedCaseEntity,
    });

  await updateCaseAndAssociations({
    authorizedUser,
    caseToUpdate: updatedCaseEntity,
  });

  return updatedCaseEntity.toRawObject();
};

export const removeCasePendingItemInteractor = withLocking(
  removeCasePendingItem,
  (_applicationContext, { docketNumber }) => ({
    identifiers: [`case|${docketNumber}`],
  }),
);
