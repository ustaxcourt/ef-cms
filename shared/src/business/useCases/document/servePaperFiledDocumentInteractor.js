const {
  addServedStampToDocument,
} = require('../courtIssuedDocument/addServedStampToDocument');
const {
  aggregatePartiesForService,
} = require('../../utilities/aggregatePartiesForService');
const {
  CONTACT_CHANGE_DOCUMENT_TYPES,
  DOCUMENT_RELATIONSHIPS,
  NOTICE_OF_DOCKET_CHANGE,
} = require('../../entities/EntityConstants');
const {
  formatDocument,
  getFilingsAndProceedings,
} = require('../../utilities/getFormattedCaseDetail');
const {
  generateNoticeOfDocketChangePdf,
} = require('../../useCaseHelper/noticeOfDocketChange/generateNoticeOfDocketChangePdf');
const {
  isAuthorized,
  ROLE_PERMISSIONS,
} = require('../../../authorization/authorizationClientService');
const { Case } = require('../../entities/cases/Case');
const { CASE_CAPTION_POSTFIX } = require('../../entities/EntityConstants');
const { DOCKET_SECTION } = require('../../entities/EntityConstants');
const { DocketRecord } = require('../../entities/DocketRecord');
const { Document } = require('../../entities/Document');
const { formatDateString } = require('../../utilities/DateHandler');
const { getCaseCaptionMeta } = require('../../utilities/getCaseCaptionMeta');
const { omit } = require('lodash');
const { replaceBracketed } = require('../../utilities/replaceBracketed');
const { UnauthorizedError } = require('../../../errors/errors');

/**
 * servePaperFiledDocumentInteractor
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {object} providers.entryMetadata the entry metadata
 * @returns {object} the updated case after the documents are added
 */
exports.servePaperFiledDocumentInteractor = async ({
  applicationContext,
  caseId,
  documentId,
}) => {
  const authorizedUser = applicationContext.getCurrentUser();

  if (!isAuthorized(authorizedUser, ROLE_PERMISSIONS.DOCKET_ENTRY)) {
    throw new UnauthorizedError('Unauthorized');
  }

  const user = await applicationContext
    .getPersistenceGateway()
    .getUserById({ applicationContext, userId: authorizedUser.userId });

  const caseToUpdate = await applicationContext
    .getPersistenceGateway()
    .getCaseByCaseId({
      applicationContext,
      caseId,
    });

  let caseEntity = new Case(caseToUpdate, { applicationContext });

  const currentDocument = caseEntity.getDocumentById({
    documentId,
  });

  const servedParties = aggregatePartiesForService(caseEntity);
  currentDocument.setAsServed(servedParties.all);
  currentDocument.setAsProcessingStatusAsCompleted();

  caseEntity.updateDocument(currentDocument);
  let paperServicePdfUrl;
  let paperServiceDocumentTitle;

  
    if (servedParties.paper.length > 0) {
      const { Body: pdfData } = await applicationContext
        .getStorageClient()
        .getObject({
          Bucket: applicationContext.environment.documentsBucketName,
          Key: currentDocument.documentId,
        })
        .promise();

      const noticeDoc = await PDFDocument.load(pdfData);

      let newPdfDoc = await PDFDocument.create();

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

      const paperServicePdfId = applicationContext.getUniqueId();

      await applicationContext.getPersistenceGateway().saveDocumentFromLambda({
        applicationContext,
        document: paperServicePdfData,
        documentId: paperServicePdfId,
        useTempBucket: true,
      });

      const {
        url,
      } = await applicationContext
        .getPersistenceGateway()
        .getDownloadPolicyUrl({
          applicationContext,
          documentId: paperServicePdfId,
          useTempBucket: true,
        });

      paperServicePdfUrl = url;
      paperServiceDocumentTitle = updatedDocument.documentTitle;
    }
  } else if (needsNoticeOfDocketChange) {
    const noticeDocumentId = await generateNoticeOfDocketChangePdf({
      applicationContext,
      docketChangeInfo,
    });

    let noticeUpdatedDocument = new Document(
      {
        ...NOTICE_OF_DOCKET_CHANGE,
        documentId: noticeDocumentId,
        userId: user.userId,
      },
      { applicationContext },
    );

    noticeUpdatedDocument.documentTitle = replaceBracketed(
      NOTICE_OF_DOCKET_CHANGE.documentTitle,
      docketChangeInfo.docketEntryIndex,
    );

    noticeUpdatedDocument.setAsServed(servedParties.all);

    caseEntity.addDocument(noticeUpdatedDocument, { applicationContext });

    const { Body: pdfData } = await applicationContext
      .getStorageClient()
      .getObject({
        Bucket: applicationContext.environment.documentsBucketName,
        Key: noticeUpdatedDocument.documentId,
      })
      .promise();

    const serviceStampDate = formatDateString(
      noticeUpdatedDocument.servedAt,
      'MMDDYY',
    );

    const newPdfData = await addServedStampToDocument({
      applicationContext,
      pdfData,
      serviceStampText: `Served ${serviceStampDate}`,
    });

    await applicationContext.getPersistenceGateway().saveDocumentFromLambda({
      applicationContext,
      document: newPdfData,
      documentId: noticeUpdatedDocument.documentId,
    });

    await applicationContext.getUseCaseHelpers().sendServedPartiesEmails({
      applicationContext,
      caseEntity,
      documentEntity: noticeUpdatedDocument,
      servedParties,
    });

    if (servedParties.paper.length > 0) {
      const noticeDoc = await PDFDocument.load(newPdfData);
      let newPdfDoc = await PDFDocument.create();

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
      const paperServicePdfId = applicationContext.getUniqueId();

      await applicationContext.getPersistenceGateway().saveDocumentFromLambda({
        applicationContext,
        document: paperServicePdfData,
        documentId: paperServicePdfId,
        useTempBucket: true,
      });

      const {
        url,
      } = await applicationContext
        .getPersistenceGateway()
        .getDownloadPolicyUrl({
          applicationContext,
          documentId: paperServicePdfId,
          useTempBucket: true,
        });

      paperServicePdfUrl = url;
      paperServiceDocumentTitle = noticeUpdatedDocument.documentTitle;
    }
  

  await applicationContext.getPersistenceGateway().updateCase({
    applicationContext,
    caseToUpdate: caseEntity.validate().toRawObject(),
  });

  await applicationContext.getUseCases().addCoversheetInteractor({
    applicationContext,
    caseId,
    documentId,
  });

  return {
    caseDetail: caseEntity.toRawObject(),
    paperServiceDocumentTitle,
    paperServiceParties: servedParties.paper,
    paperServicePdfUrl,
  };
};
