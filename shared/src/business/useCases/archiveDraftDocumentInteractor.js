const {
  ARCHIVE_DOCUMENT,
  isAuthorized,
} = require('../../authorization/authorizationClientService');
const { Case } = require('../entities/cases/Case');
const { UnauthorizedError } = require('../../errors/errors');

/**
 * archiveDraftDocumentInteractor
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {string} providers.caseId the id of the case to update notes
 * @param {string} providers.notes the notes to update
 * @returns {object} the updated case note returned from persistence
 */
exports.archiveDraftDocumentInteractor = async ({
  applicationContext,
  caseId,
  documentId,
}) => {
  const user = applicationContext.getCurrentUser();

  if (!isAuthorized(user, ARCHIVE_DOCUMENT)) {
    throw new UnauthorizedError('Unauthorized');
  }

  const caseToUpdate = await applicationContext
    .getPersistenceGateway()
    .getCaseByCaseId({
      applicationContext,
      caseId,
    });

  const caseEntity = new Case(caseToUpdate, { applicationContext });

  const documentToArchive = caseEntity.getDocumentById({ documentId });

  documentToArchive.archive();

  await applicationContext.getPersistenceGateway().updateCase({
    applicationContext,
    caseToUpdate: caseEntity.validate().toRawObject(),
  });

  await Promise.all(
    documentToArchive.workItems.map(workItem =>
      Promise.all(
        applicationContext.getPersistenceGateway().deleteWorkItemFromInbox({
          applicationContext,
          workItem,
        }),
        applicationContext.getPersistenceGateway().deleteSectionOutboxRecord({
          applicationContext,
          createdAt: workItem.createdAt,
          section: workItem.sentBySection,
        }),
        applicationContext.getPersistenceGateway().deleteUserOutboxRecord({
          applicationContext,
          createdAt: workItem.createdAt,
          userId: workItem.sentByUserId,
        }),
      ),
    ),
  );
};
