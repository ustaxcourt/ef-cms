const sanitize = require('sanitize-filename');
const {
  aggregatePartiesForService,
} = require('../../utilities/aggregatePartiesForService');
const {
  isAuthorized,
  ROLE_PERMISSIONS,
} = require('../../../authorization/authorizationClientService');
const { createISODateString } = require('../../utilities/DateHandler');
const { Document } = require('../../entities/Document');
const { PDFDocument } = require('pdf-lib');
const { PETITIONS_SECTION } = require('../../entities/WorkQueue');
const { UnauthorizedError } = require('../../../errors/errors');

exports.addDocketEntryForPaymentStatus = ({
  applicationContext,
  caseEntity,
}) => {
  const { Case, DocketRecord } = applicationContext.getEntityConstructors();

  if (caseEntity.petitionPaymentStatus === Case.PAYMENT_STATUS.PAID) {
    caseEntity.addDocketRecord(
      new DocketRecord(
        {
          description: 'Filing Fee Paid',
          eventCode: 'FEE',
          filingDate: caseEntity.petitionPaymentDate,
        },
        { applicationContext },
      ),
    );
  } else if (caseEntity.petitionPaymentStatus === Case.PAYMENT_STATUS.WAIVED) {
    caseEntity.addDocketRecord(
      new DocketRecord(
        {
          description: 'Filing Fee Waived',
          eventCode: 'FEEW',
          filingDate: caseEntity.petitionPaymentWaivedDate,
        },
        { applicationContext },
      ),
    );
  }
};

exports.uploadZipOfDocuments = async ({ applicationContext, caseEntity }) => {
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

  return { fileNames, s3Ids, zipName };
};

exports.deleteStinIfAvailable = async ({ applicationContext, caseEntity }) => {
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
};

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

  const { Case } = applicationContext.getEntityConstructors();
  const caseEntity = new Case(caseToBatch, { applicationContext });

  exports.addDocketEntryForPaymentStatus({ applicationContext, caseEntity });

  caseEntity
    .updateCaseTitleDocketRecord({ applicationContext })
    .updateDocketNumberRecord({ applicationContext })
    .validate();

  await exports.uploadZipOfDocuments({
    applicationContext,
    caseEntity,
  });

  await exports.deleteStinIfAvailable({ applicationContext, caseEntity });

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
