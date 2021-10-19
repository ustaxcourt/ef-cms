const {
  isAuthorized,
  ROLE_PERMISSIONS,
} = require('../../authorization/authorizationClientService');
const { Case } = require('../entities/cases/Case');
const { UnauthorizedError } = require('../../errors/errors');

/**
 * archiveDraftDocumentInteractor
 *
 * @param {object} applicationContext the application context
 * @param {object} providers the providers object
 * @param {string} providers.docketNumber the docket number of the case on which a document will be archived
 * @param {string} providers.docketEntryId the id of the docket entry which will be archived
 * @returns {object} the updated case note returned from persistence
 */
exports.archiveDraftDocumentInteractor = async (
  applicationContext,
  { docketEntryId, docketNumber },
) => {
  const user = applicationContext.getCurrentUser();

  if (!isAuthorized(user, ROLE_PERMISSIONS.ARCHIVE_DOCUMENT)) {
    throw new UnauthorizedError('Unauthorized');
  }

  const caseToUpdate = await applicationContext
    .getPersistenceGateway()
    .getCaseByDocketNumber({
      applicationContext,
      docketNumber,
    });

  const caseEntity = new Case(caseToUpdate, { applicationContext });

  const docketEntryToArchive = caseEntity.getDocketEntryById({
    docketEntryId,
  });

  caseEntity.archiveDocketEntry(docketEntryToArchive, { applicationContext });

  const { workItem } = docketEntryToArchive;

  if (workItem) {
    await applicationContext.getPersistenceGateway().deleteWorkItem({
      applicationContext,
      workItem,
    });
  }

  const updatedCase = await applicationContext
    .getUseCaseHelpers()
    .updateCaseAndAssociations({
      applicationContext,
      caseToUpdate: caseEntity,
    });

  return new Case(updatedCase, { applicationContext }).validate().toRawObject();
};
