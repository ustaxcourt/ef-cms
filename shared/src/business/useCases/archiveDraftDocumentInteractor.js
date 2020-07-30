const {
  isAuthorized,
  ROLE_PERMISSIONS,
} = require('../../authorization/authorizationClientService');
const { Case } = require('../entities/cases/Case');
const { UnauthorizedError } = require('../../errors/errors');

/**
 * archiveDraftDocumentInteractor
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {string} providers.docketNumber the docket number of the case on which a document will be archived
 * @param {string} providers.documentId the id of the document which will be archived
 * @returns {object} the updated case note returned from persistence
 */
exports.archiveDraftDocumentInteractor = async ({
  applicationContext,
  docketNumber,
  documentId,
}) => {
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

  const documentToArchive = caseEntity.getDocumentById({ documentId });

  documentToArchive.archive();

  await applicationContext.getPersistenceGateway().updateCase({
    applicationContext,
    caseToUpdate: caseEntity.validate().toRawObject(),
  });

  await Promise.all(
    documentToArchive.workItems.map(workItem =>
      Promise.all([
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
      ]),
    ),
  );
};
