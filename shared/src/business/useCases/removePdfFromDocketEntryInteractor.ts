import { Case } from '../entities/cases/Case';
import {
  ROLE_PERMISSIONS,
  isAuthorized,
} from '../../authorization/authorizationClientService';
import { UnauthorizedError } from '@web-api/errors/errors';
import { withLocking } from '@shared/business/useCaseHelper/acquireLock';

/**
 * removePdfFromDocketEntry
 * @param {object} applicationContext the application context
 * @param {object} providers the providers object
 * @param {string} providers.docketNumber the docket number of the case to update
 * @param {object} providers.docketEntryId the docket entry id for the file to be removed
 * @returns {object} the updated case data
 */
export const removePdfFromDocketEntry = async (
  applicationContext,
  { docketEntryId, docketNumber },
) => {
  const authorizedUser = applicationContext.getCurrentUser();

  if (!isAuthorized(authorizedUser, ROLE_PERMISSIONS.UPDATE_CASE)) {
    throw new UnauthorizedError('Unauthorized for update case');
  }

  const caseRecord = await applicationContext
    .getPersistenceGateway()
    .getCaseByDocketNumber({
      applicationContext,
      docketNumber,
    });

  const caseEntity = new Case(caseRecord, {
    applicationContext,
  });

  const docketEntry = caseEntity.getDocketEntryById({ docketEntryId });

  if (docketEntry && docketEntry.isFileAttached) {
    await applicationContext.getPersistenceGateway().deleteDocumentFile({
      applicationContext,
      key: docketEntryId,
    });

    docketEntry.isFileAttached = false;
    caseEntity.updateDocketEntry(docketEntry);

    const updatedCase = await applicationContext
      .getUseCaseHelpers()
      .updateCaseAndAssociations({
        applicationContext,
        caseToUpdate: caseEntity,
      });

    return new Case(updatedCase, { applicationContext }).toRawObject();
  }
};

export const removePdfFromDocketEntryInteractor = withLocking(
  removePdfFromDocketEntry,
  (_applicationContext, { docketNumber }) => ({
    identifiers: [`case|${docketNumber}`],
  }),
);
