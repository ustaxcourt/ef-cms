const sanitize = require('sanitize-filename');
const {
  IRS_BATCH_SYSTEM_SECTION,
  PETITIONS_SECTION,
} = require('../entities/WorkQueue');
const {
  isAuthorized,
  UPDATE_CASE,
} = require('../../authorization/authorizationClientService');
const { Case } = require('../entities/cases/Case');
const { createISODateString } = require('../utilities/DateHandler');
const { Document } = require('../entities/Document');
const { UnauthorizedError } = require('../../errors/errors');

/**
 * runBatchProcessInteractor
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @returns {object} the processed cases as zip files
 */
exports.runBatchProcessInteractor = async ({ applicationContext }) => {
  const user = applicationContext.getCurrentUser();

  if (!isAuthorized(user, UPDATE_CASE)) {
    throw new UnauthorizedError('Unauthorized for send to IRS Holding Queue');
  }

  const workItemsInHoldingQueue = await applicationContext
    .getPersistenceGateway()
    .getDocumentQCInboxForSection({
      applicationContext,
      section: IRS_BATCH_SYSTEM_SECTION,
    });

  let zips = [];
  const processWorkItem = async workItem => {
    const caseToBatch = await applicationContext
      .getPersistenceGateway()
      .getCaseByCaseId({
        applicationContext,
        caseId: workItem.caseId,
      });

    await applicationContext.getPersistenceGateway().deleteWorkItemFromSection({
      applicationContext,
      workItem,
    });

    const s3Ids = caseToBatch.documents.map(document => document.documentId);
    const fileNames = caseToBatch.documents.map(
      document => `${document.documentType}.pdf`,
    );
    let zipName = sanitize(`${caseToBatch.docketNumber}`);

    if (caseToBatch.contactPrimary && caseToBatch.contactPrimary.name) {
      zipName += sanitize(
        `_${caseToBatch.contactPrimary.name.replace(/\s/g, '_')}`,
      );
    }
    zipName += '.zip';

    await applicationContext.getPersistenceGateway().zipDocuments({
      applicationContext,
      fileNames,
      s3Ids,
      zipName,
    });

    const stinDocument = caseToBatch.documents.find(
      document =>
        document.documentType ===
        Document.INITIAL_DOCUMENT_TYPES.stin.documentType,
    );

    if (stinDocument) {
      await applicationContext.getPersistenceGateway().deleteDocument({
        applicationContext,
        key: stinDocument.documentId,
      });
    }

    const caseEntity = new Case({
      applicationContext,
      rawCase: caseToBatch,
    }).markAsSentToIRS(createISODateString());

    const petitionDocument = caseEntity.documents.find(
      document =>
        document.documentType ===
        Document.INITIAL_DOCUMENT_TYPES.petition.documentType,
    );

    const petitionDocumentEntity = new Document(petitionDocument);
    petitionDocumentEntity.setAsServed();
    caseEntity.updateDocument(petitionDocumentEntity);

    const initializeCaseWorkItem = petitionDocument.workItems.find(
      workItem => workItem.isInitializeCase,
    );

    const lastMessage = initializeCaseWorkItem.getLatestMessageEntity();
    const batchedByUserId = lastMessage.fromUserId;
    const batchedByName = lastMessage.from;

    initializeCaseWorkItem.setAsSentToIRS({
      batchedByName,
      batchedByUserId,
    });

    await Promise.all([
      applicationContext.getPersistenceGateway().putWorkItemInUsersOutbox({
        applicationContext,
        section: PETITIONS_SECTION,
        userId: batchedByUserId,
        workItem: initializeCaseWorkItem,
      }),
      applicationContext.getPersistenceGateway().updateCase({
        applicationContext,
        caseToUpdate: caseEntity.validate().toRawObject(),
      }),
      applicationContext.getPersistenceGateway().updateWorkItem({
        applicationContext,
        workItemToUpdate: initializeCaseWorkItem,
      }),
    ]);

    zips = zips.concat({
      fileNames,
      s3Ids,
      zipName,
    });
  };

  await Promise.all(workItemsInHoldingQueue.map(processWorkItem));

  return {
    processedCases: zips,
  };
};
