const {
  isAuthorized,
  ROLE_PERMISSIONS,
} = require('../../authorization/authorizationClientService');
const { Case } = require('../entities/cases/Case');
const { UnauthorizedError } = require('../../errors/errors');

/**
 * removeCasePendingItemInteractor
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {string} providers.docketNumber the docket number of the case to update
 * @param {object} providers.docketEntryId the id of the docket entry no longer pending
 * @returns {object} the updated case data
 */
exports.removeCasePendingItemInteractor = async ({
  applicationContext,
  docketEntryId,
  docketNumber,
}) => {
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

  const updatedCase = updatedCaseEntity.validate().toRawObject();

  await applicationContext.getPersistenceGateway().updateCase({
    applicationContext,
    caseToUpdate: updatedCase,
  });

  return updatedCase;
};
