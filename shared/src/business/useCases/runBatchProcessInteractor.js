const sanitize = require('sanitize-filename');
const {
  IRS_BATCH_SYSTEM_SECTION,
  PETITIONS_SECTION,
} = require('../entities/WorkQueue');
const {
  isAuthorized,
  ROLE_PERMISSIONS,
} = require('../../authorization/authorizationClientService');
const { Case } = require('../entities/cases/Case');
const { createISODateString } = require('../utilities/DateHandler');
const { Document } = require('../entities/Document');
const { IRS_BATCH_SYSTEM_USER_ID, WorkItem } = require('../entities/WorkItem');
const { Message } = require('../entities/Message');
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

  if (!isAuthorized(user, ROLE_PERMISSIONS.UPDATE_CASE)) {
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

    const caseEntity = new Case(caseToBatch, { applicationContext });

    await applicationContext.getPersistenceGateway().deleteWorkItemFromSection({
      applicationContext,
      workItem,
    });

    const s3Ids = caseEntity.documents
      .filter(document => !caseEntity.isDocumentDraft(document.documentId))
      .map(document => document.documentId);
    const fileNames = caseEntity.documents.map(
      document => `${document.documentType}.pdf`,
    );
    let zipName = sanitize(`${caseEntity.docketNumber}`);

    if (caseEntity.contactPrimary && caseEntity.contactPrimary.name) {
      zipName += sanitize(
        `_${caseEntity.contactPrimary.name.replace(/\s/g, '_')}`,
      );
    }
    zipName += '.zip';

    await applicationContext.getPersistenceGateway().zipDocuments({
      applicationContext,
      fileNames,
      s3Ids,
      zipName,
    });

    const stinDocument = caseEntity.documents.find(
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

    caseEntity.markAsSentToIRS(createISODateString());

    const petitionDocument = caseEntity.documents.find(
      document =>
        document.documentType ===
        Document.INITIAL_DOCUMENT_TYPES.petition.documentType,
    );

    const petitionDocumentEntity = new Document(petitionDocument, {
      applicationContext,
    });
    petitionDocumentEntity.setAsServed();
    caseEntity.updateDocument(petitionDocumentEntity);

    const initializeCaseWorkItem = petitionDocument.workItems.find(
      workItem => workItem.isInitializeCase,
    );

    const lastMessage = initializeCaseWorkItem.getLatestMessageEntity();
    const batchedByUserId = lastMessage.fromUserId;
    const batchedByName = lastMessage.from;

    initializeCaseWorkItem.setAsSentToIRS({
      applicationContext,
      batchedByName,
      batchedByUserId,
    });

    const casePromises = [
      applicationContext.getPersistenceGateway().putWorkItemInUsersOutbox({
        applicationContext,
        section: PETITIONS_SECTION,
        userId: batchedByUserId,
        workItem: initializeCaseWorkItem,
      }),
      applicationContext.getPersistenceGateway().updateWorkItem({
        applicationContext,
        workItemToUpdate: initializeCaseWorkItem,
      }),
    ];

    if (caseEntity.isPaper) {
      const qcWorkItem = petitionDocument.getQCWorkItem();

      const qcWorkItemUser = await applicationContext
        .getPersistenceGateway()
        .getUserById({
          applicationContext,
          userId: qcWorkItem.completedByUserId,
        });

      const message = 'Case confirmation is ready to be printed.';

      const workItemEntity = new WorkItem(
        {
          assigneeId: qcWorkItemUser.userId,
          assigneeName: qcWorkItemUser.name,
          caseId: caseEntity.caseId,
          caseStatus: caseEntity.status,
          caseTitle: Case.getCaseCaptionNames(Case.getCaseCaption(caseEntity)),
          docketNumber: caseEntity.docketNumber,
          docketNumberSuffix: caseEntity.docketNumberSuffix,
          document: {
            ...petitionDocumentEntity.toRawObject(),
            createdAt: petitionDocumentEntity.createdAt,
          },
          isInitializeCase: false,
          isQC: false,
          section: qcWorkItemUser.section,
          sentBy: 'IRS Holding Queue',
          sentBySection: IRS_BATCH_SYSTEM_SECTION,
          sentByUserId: IRS_BATCH_SYSTEM_USER_ID,
        },
        { applicationContext },
      );

      const newMessage = new Message(
        {
          from: 'IRS Holding Queue',
          fromUserId: IRS_BATCH_SYSTEM_USER_ID,
          message,
          to: qcWorkItemUser.name,
          toUserId: qcWorkItemUser.userId,
        },
        { applicationContext },
      );

      workItemEntity.addMessage(newMessage);
      petitionDocumentEntity.addWorkItem(workItemEntity);
      caseEntity.updateDocument(petitionDocumentEntity);

      casePromises.push(
        applicationContext.getPersistenceGateway().saveWorkItemForPaper({
          applicationContext,
          messageId: newMessage.messageId,
          workItem: workItemEntity.validate().toRawObject(),
        }),
      );
    }

    casePromises.push(
      applicationContext.getPersistenceGateway().updateCase({
        applicationContext,
        caseToUpdate: caseEntity.validate().toRawObject(),
      }),
      applicationContext.getUseCaseHelpers().generateCaseConfirmationPdf({
        applicationContext,
        caseEntity,
      }),
    );

    await Promise.all(casePromises);

    zips = zips.concat({
      fileNames,
      s3Ids,
      zipName,
    });
  };

  // can't use promise.all here because generating the case confirmation PDFs
  // all at the same time causes errors
  for (const workItem of workItemsInHoldingQueue) {
    await processWorkItem(workItem);
  }

  return {
    processedCases: zips,
  };
};
