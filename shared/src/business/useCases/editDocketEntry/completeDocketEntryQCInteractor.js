const {
  addServedStampToDocument,
} = require('../../useCases/courtIssuedDocument/addServedStampToDocument');
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
 * completeDocketEntryQCInteractor
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {object} providers.entryMetadata the entry metadata
 * @returns {object} the updated case after the documents are added
 */
exports.completeDocketEntryQCInteractor = async ({
  applicationContext,
  entryMetadata,
}) => {
  const authorizedUser = applicationContext.getCurrentUser();

  const { PDFDocument } = await applicationContext.getPdfLib();

  if (!isAuthorized(authorizedUser, ROLE_PERMISSIONS.DOCKET_ENTRY)) {
    throw new UnauthorizedError('Unauthorized');
  }

  const { caseId, documentId, overridePaperServiceAddress } = entryMetadata;

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
  const { index: docketRecordIndexUpdated } = caseEntity.docketRecord.find(
    record => record.documentId === documentId,
  );

  const currentDocument = caseEntity.getDocumentById({
    documentId,
  });

  const editableFields = {
    addToCoversheet: entryMetadata.addToCoversheet,
    additionalInfo: entryMetadata.additionalInfo,
    additionalInfo2: entryMetadata.additionalInfo2,
    attachments: entryMetadata.attachments,
    certificateOfService: entryMetadata.certificateOfService,
    certificateOfServiceDate: entryMetadata.certificateOfServiceDate,
    documentTitle: entryMetadata.documentTitle,
    documentType: entryMetadata.documentType,
    eventCode: entryMetadata.eventCode,
    freeText: entryMetadata.freeText,
    freeText2: entryMetadata.freeText2,
    isFileAttached: entryMetadata.isFileAttached,
    lodged: entryMetadata.lodged,
    mailingDate: entryMetadata.mailingDate,
    objections: entryMetadata.objections,
    ordinalValue: entryMetadata.ordinalValue,
    otherFilingParty: entryMetadata.otherFilingParty,
    partyIrsPractitioner: entryMetadata.partyIrsPractitioner,
    partyPrimary: entryMetadata.partyPrimary,
    partySecondary: entryMetadata.partySecondary,
    pending: entryMetadata.pending,
    receivedAt: entryMetadata.receivedAt,
    scenario: entryMetadata.scenario,
    serviceDate: entryMetadata.serviceDate,
  };

  const updatedDocument = new Document(
    {
      ...currentDocument,
      ...editableFields,
      relationship: DOCUMENT_RELATIONSHIPS.PRIMARY,
      userId: user.userId,
      ...caseEntity.getCaseContacts({
        contactPrimary: true,
        contactSecondary: true,
      }),
    },
    { applicationContext },
  ).validate();

  updatedDocument.generateFiledBy(caseToUpdate, true);
  updatedDocument.setQCed(user);

  let updatedDocumentTitle = updatedDocument.documentTitle;
  if (updatedDocument.additionalInfo) {
    updatedDocumentTitle += ` ${updatedDocument.additionalInfo}`;
  }
  updatedDocumentTitle += ` ${getFilingsAndProceedings(
    formatDocument(applicationContext, updatedDocument),
  )}`;
  if (updatedDocument.additionalInfo2) {
    updatedDocumentTitle += ` ${updatedDocument.additionalInfo2}`;
  }

  let currentDocumentTitle = currentDocument.documentTitle;
  if (currentDocument.additionalInfo) {
    currentDocumentTitle += ` ${currentDocument.additionalInfo}`;
  }
  currentDocumentTitle += ` ${getFilingsAndProceedings(
    formatDocument(applicationContext, currentDocument),
  )}`;
  if (currentDocument.additionalInfo2) {
    currentDocumentTitle += ` ${currentDocument.additionalInfo2}`;
  }

  const needsNewCoversheet =
    updatedDocument.additionalInfo !== currentDocument.additionalInfo ||
    updatedDocumentTitle !== currentDocumentTitle;

  const needsNoticeOfDocketChange =
    updatedDocument.filedBy !== currentDocument.filedBy ||
    updatedDocumentTitle !== currentDocumentTitle;

  const { caseCaptionExtension, caseTitle } = getCaseCaptionMeta(caseEntity);

  const docketChangeInfo = {
    caseCaptionExtension,
    caseCaptionWithPostfix: `${caseToUpdate.caseCaption} ${CASE_CAPTION_POSTFIX}`,
    caseTitle,
    docketEntryIndex: docketRecordIndexUpdated,
    docketNumber: `${caseToUpdate.docketNumber}${
      caseToUpdate.docketNumberSuffix || ''
    }`,
    filingParties: {
      after: updatedDocument.filedBy,
      before: currentDocument.filedBy,
    },
    filingsAndProceedings: {
      after: updatedDocumentTitle,
      before: currentDocumentTitle,
    },
  };

  const existingDocketRecordEntry = caseEntity.getDocketRecordByDocumentId(
    updatedDocument.documentId,
  );

  const docketRecordEntry = new DocketRecord(
    {
      ...existingDocketRecordEntry,
      description: updatedDocumentTitle,
      documentId: updatedDocument.documentId,
      editState: '{}',
      eventCode: updatedDocument.eventCode,
      filingDate: updatedDocument.receivedAt,
    },
    { applicationContext },
  );

  caseEntity.updateDocketRecordEntry(omit(docketRecordEntry, 'index'));
  caseEntity.updateDocument(updatedDocument);

  const workItemToUpdate = updatedDocument.getQCWorkItem();

  if (workItemToUpdate) {
    await applicationContext.getPersistenceGateway().deleteWorkItemFromInbox({
      applicationContext,
      workItem: workItemToUpdate,
    });

    Object.assign(workItemToUpdate, {
      caseId: caseId,
      caseIsInProgress: caseEntity.inProgress,
      caseStatus: caseToUpdate.status,
      docketNumber: caseToUpdate.docketNumber,
      docketNumberSuffix: caseToUpdate.docketNumberSuffix,
      document: {
        ...updatedDocument.toRawObject(),
        createdAt: updatedDocument.createdAt,
      },
    });

    if (!workItemToUpdate.completedAt) {
      Object.assign(workItemToUpdate, {
        assigneeId: null,
        assigneeName: null,
        section: DOCKET_SECTION,
        sentBy: user.userId,
      });

      workItemToUpdate.setAsCompleted({
        message: 'completed',
        user,
      });

      workItemToUpdate.assignToUser({
        assigneeId: user.userId,
        assigneeName: user.name,
        section: user.section,
        sentBy: user.name,
        sentBySection: user.section,
        sentByUserId: user.userId,
      });
    }

    await applicationContext
      .getPersistenceGateway()
      .saveWorkItemForDocketClerkFilingExternalDocument({
        applicationContext,
        workItem: workItemToUpdate.validate().toRawObject(),
      });
  }

  let servedParties = aggregatePartiesForService(caseEntity);
  let paperServicePdfUrl;
  let paperServiceDocumentTitle;

  if (
    overridePaperServiceAddress ||
    CONTACT_CHANGE_DOCUMENT_TYPES.includes(updatedDocument.documentType)
  ) {
    if (servedParties.paper.length > 0) {
      const { Body: pdfData } = await applicationContext
        .getStorageClient()
        .getObject({
          Bucket: applicationContext.environment.documentsBucketName,
          Key: updatedDocument.documentId,
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
  }

  await applicationContext.getPersistenceGateway().updateCase({
    applicationContext,
    caseToUpdate: caseEntity.validate().toRawObject(),
  });

  if (needsNewCoversheet) {
    await applicationContext.getUseCases().addCoversheetInteractor({
      applicationContext,
      caseId,
      documentId,
    });
  }

  return {
    caseDetail: caseEntity.toRawObject(),
    paperServiceDocumentTitle,
    paperServiceParties: servedParties.paper,
    paperServicePdfUrl,
  };
};
