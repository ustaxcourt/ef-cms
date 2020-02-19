const {
  addDocketEntryForPaymentStatus,
  deleteStinIfAvailable,
  uploadZipOfDocuments,
} = require('../runBatchProcessInteractor');
const {
  aggregatePartiesForService,
} = require('../../utilities/aggregatePartiesForService');
const {
  isAuthorized,
  ROLE_PERMISSIONS,
} = require('../../../authorization/authorizationClientService');
const { Case } = require('../../entities/cases/Case');
const { createISODateString } = require('../../utilities/DateHandler');
const { Document } = require('../../entities/Document');
const { PDFDocument } = require('pdf-lib');
const { PETITIONS_SECTION } = require('../../entities/WorkQueue');
const { UnauthorizedError } = require('../../../errors/errors');

/**
 * serveCaseToIrsInteractor
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {string} providers.caseId the id of the case
 */
exports.serveCaseToIrsInteractor = async ({ applicationContext, caseId }) => {
  const user = applicationContext.getCurrentUser();

  if (!isAuthorized(user, ROLE_PERMISSIONS.UPDATE_CASE)) {
    throw new UnauthorizedError('Unauthorized');
  }

  const caseToBatch = await applicationContext
    .getPersistenceGateway()
    .getCaseByCaseId({
      applicationContext,
      caseId: caseId,
    });

  const caseEntity = new Case(caseToBatch, { applicationContext });

  addDocketEntryForPaymentStatus({ caseEntity });

  caseEntity
    .updateCaseTitleDocketRecord({ applicationContext })
    .updateDocketNumberRecord({ applicationContext })
    .validate();

  await uploadZipOfDocuments({
    applicationContext,
    caseEntity,
  });

  await deleteStinIfAvailable({ applicationContext, caseEntity });

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

  await applicationContext.getPersistenceGateway().deleteWorkItemFromInbox({
    applicationContext,
    workItem: initializeCaseWorkItem.validate().toRawObject(),
  });

  initializeCaseWorkItem.setAsCompleted({
    message: 'Served to IRS',
    user: user,
  });

  const casePromises = [
    applicationContext.getPersistenceGateway().putWorkItemInUsersOutbox({
      applicationContext,
      section: PETITIONS_SECTION,
      userId: user.userId,
      workItem: initializeCaseWorkItem,
    }),
    applicationContext.getPersistenceGateway().updateWorkItem({
      applicationContext,
      workItemToUpdate: initializeCaseWorkItem,
    }),
    applicationContext.getPersistenceGateway().updateCase({
      applicationContext,
      caseToUpdate: caseEntity.validate().toRawObject(),
    }),
    applicationContext.getUseCaseHelpers().generateCaseConfirmationPdf({
      applicationContext,
      caseEntity,
    }),
  ];

  const results = await Promise.all(casePromises);

  if (caseEntity.isPaper) {
    const pdfData = results[3];
    const noticeDoc = await PDFDocument.load(pdfData);
    const newPdfDoc = await PDFDocument.create();

    const servedParties = aggregatePartiesForService(caseEntity);

    await applicationContext
      .getUseCaseHelpers()
      .appendPaperServiceAddressPageToPdf({
        applicationContext,
        caseEntity,
        newPdfDoc,
        noticeDoc,
        servedParties,
      });

    const paperServicePdfData = await newPdfDoc.save();
    const paperServicePdfBuffer = Buffer.from(paperServicePdfData);

    return paperServicePdfBuffer;
  }
};
