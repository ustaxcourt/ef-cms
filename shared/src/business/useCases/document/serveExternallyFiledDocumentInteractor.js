const {
  aggregatePartiesForService,
} = require('../../utilities/aggregatePartiesForService');
const {
  isAuthorized,
  ROLE_PERMISSIONS,
} = require('../../../authorization/authorizationClientService');
const { addCoverToPdf } = require('../addCoversheetInteractor');
const { Case } = require('../../entities/cases/Case');
const { UnauthorizedError } = require('../../../errors/errors');

/**
 * serveExternallyFiledDocumentInteractor
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {string} providers.docketNumber the docket number of the case containing the document to serve
 * @param {string} providers.documentId the id of the document to serve
 * @returns {object} the paper service pdf url
 */
exports.serveExternallyFiledDocumentInteractor = async ({
  applicationContext,
  docketNumber,
  documentId,
}) => {
  const authorizedUser = applicationContext.getCurrentUser();

  const { PDFDocument } = await applicationContext.getPdfLib();

  if (!isAuthorized(authorizedUser, ROLE_PERMISSIONS.SERVE_DOCUMENT)) {
    throw new UnauthorizedError('Unauthorized');
  }

  const caseToUpdate = await applicationContext
    .getPersistenceGateway()
    .getCaseByDocketNumber({
      applicationContext,
      docketNumber,
    });

  let caseEntity = new Case(caseToUpdate, { applicationContext });

  const currentDocument = caseEntity.getDocumentById({
    documentId,
  });

  const servedParties = aggregatePartiesForService(caseEntity);
  currentDocument.setAsServed(servedParties.all);
  currentDocument.setAsProcessingStatusAsCompleted();

  caseEntity.updateDocument(currentDocument);

  const { Body: pdfData } = await applicationContext
    .getStorageClient()
    .getObject({
      Bucket: applicationContext.environment.documentsBucketName,
      Key: documentId,
    })
    .promise();

  const { pdfData: servedDocWithCover } = await addCoverToPdf({
    applicationContext,
    caseEntity,
    documentEntity: currentDocument,
    pdfData: pdfData,
  });

  await applicationContext.getPersistenceGateway().saveDocumentFromLambda({
    applicationContext,
    document: servedDocWithCover,
    documentId,
  });

  let paperServicePdfUrl;

  if (servedParties.paper.length > 0) {
    const originalDoc = await PDFDocument.load(servedDocWithCover);

    let newPdfDoc = await PDFDocument.create();

    await applicationContext
      .getUseCaseHelpers()
      .appendPaperServiceAddressPageToPdf({
        applicationContext,
        caseEntity,
        newPdfDoc,
        noticeDoc: originalDoc,
        servedParties,
      });

    const paperServicePdfData = await newPdfDoc.save();

    const paperServicePdfId = applicationContext.getUniqueId();

    await applicationContext.getPersistenceGateway().saveDocumentFromLambda({
      applicationContext,
      document: paperServicePdfData,
      documentId: paperServicePdfId,
      useTempBucket: true,
    });

    const {
      url,
    } = await applicationContext.getPersistenceGateway().getDownloadPolicyUrl({
      applicationContext,
      documentId: paperServicePdfId,
      useTempBucket: true,
    });

    paperServicePdfUrl = url;
  }

  await applicationContext.getUseCaseHelpers().sendServedPartiesEmails({
    applicationContext,
    caseEntity,
    documentEntity: currentDocument,
    servedParties,
  });

  await applicationContext.getPersistenceGateway().updateCase({
    applicationContext,
    caseToUpdate: caseEntity.validate().toRawObject(),
  });

  return {
    paperServicePdfUrl,
  };
};
