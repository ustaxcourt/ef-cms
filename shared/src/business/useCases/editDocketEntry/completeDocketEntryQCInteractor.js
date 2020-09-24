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
  DOCKET_SECTION,
  DOCUMENT_PROCESSING_STATUS_OPTIONS,
} = require('../../entities/EntityConstants');
const {
  formatDocketEntry,
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
const { DocketEntry } = require('../../entities/DocketEntry');
const { formatDateString } = require('../../utilities/DateHandler');
const { getCaseCaptionMeta } = require('../../utilities/getCaseCaptionMeta');
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

  const {
    docketEntryId,
    docketNumber,
    overridePaperServiceAddress,
  } = entryMetadata;

  const user = await applicationContext
    .getPersistenceGateway()
    .getUserById({ applicationContext, userId: authorizedUser.userId });

  const caseToUpdate = await applicationContext
    .getPersistenceGateway()
    .getCaseByDocketNumber({
      applicationContext,
      docketNumber,
    });

  let caseEntity = new Case(caseToUpdate, { applicationContext });
  const { index: docketRecordIndexUpdated } = caseEntity.docketEntries.find(
    record => record.docketEntryId === docketEntryId,
  );

  const currentDocketEntry = caseEntity.getDocketEntryById({
    docketEntryId,
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
    hasOtherFilingParty: entryMetadata.hasOtherFilingParty,
    isFileAttached: true,
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

  const updatedDocketEntry = new DocketEntry(
    {
      ...currentDocketEntry,
      filedBy: undefined, // allow constructor to re-generate
      ...editableFields,
      documentTitle: editableFields.documentTitle,
      editState: '{}',
      relationship: DOCUMENT_RELATIONSHIPS.PRIMARY,
      userId: user.userId,
      ...caseEntity.getCaseContacts({
        contactPrimary: true,
        contactSecondary: true,
      }),
    },
    { applicationContext },
  ).validate();
  updatedDocketEntry.setQCed(user);

  let updatedDocumentTitle = updatedDocketEntry.documentTitle;
  if (updatedDocketEntry.additionalInfo) {
    updatedDocumentTitle += ` ${updatedDocketEntry.additionalInfo}`;
  }
  updatedDocumentTitle += ` ${getFilingsAndProceedings(
    formatDocketEntry(applicationContext, updatedDocketEntry),
  )}`;
  if (updatedDocketEntry.additionalInfo2) {
    updatedDocumentTitle += ` ${updatedDocketEntry.additionalInfo2}`;
  }

  let currentDocumentTitle = currentDocketEntry.documentTitle;
  if (currentDocketEntry.additionalInfo) {
    currentDocumentTitle += ` ${currentDocketEntry.additionalInfo}`;
  }
  currentDocumentTitle += ` ${getFilingsAndProceedings(
    formatDocketEntry(applicationContext, currentDocketEntry),
  )}`;
  if (currentDocketEntry.additionalInfo2) {
    currentDocumentTitle += ` ${currentDocketEntry.additionalInfo2}`;
  }

  const needsNewCoversheet =
    updatedDocketEntry.additionalInfo !== currentDocketEntry.additionalInfo ||
    updatedDocumentTitle !== currentDocumentTitle;

  const needsNoticeOfDocketChange =
    updatedDocketEntry.filedBy !== currentDocketEntry.filedBy ||
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
      after: updatedDocketEntry.filedBy,
      before: currentDocketEntry.filedBy,
    },
    filingsAndProceedings: {
      after: updatedDocumentTitle,
      before: currentDocumentTitle,
    },
  };

  caseEntity.updateDocketEntry(updatedDocketEntry);

  const workItemToUpdate = updatedDocketEntry.workItem;

  if (workItemToUpdate) {
    await applicationContext.getPersistenceGateway().deleteWorkItemFromInbox({
      applicationContext,
      workItem: workItemToUpdate.validate().toRawObject(),
    });

    Object.assign(workItemToUpdate, {
      caseIsInProgress: caseEntity.inProgress,
      caseStatus: caseToUpdate.status,
      docketEntry: {
        ...updatedDocketEntry.toRawObject(),
        createdAt: updatedDocketEntry.createdAt,
      },
      docketNumber: caseToUpdate.docketNumber,
      docketNumberSuffix: caseToUpdate.docketNumberSuffix,
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
    CONTACT_CHANGE_DOCUMENT_TYPES.includes(updatedDocketEntry.documentType)
  ) {
    if (servedParties.paper.length > 0) {
      const { Body: pdfData } = await applicationContext
        .getStorageClient()
        .getObject({
          Bucket: applicationContext.environment.documentsBucketName,
          Key: updatedDocketEntry.docketEntryId,
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
        key: paperServicePdfId,
        useTempBucket: true,
      });

      const {
        url,
      } = await applicationContext
        .getPersistenceGateway()
        .getDownloadPolicyUrl({
          applicationContext,
          key: paperServicePdfId,
          useTempBucket: true,
        });

      paperServicePdfUrl = url;
      paperServiceDocumentTitle = updatedDocketEntry.documentTitle;
    }
  } else if (needsNoticeOfDocketChange) {
    const noticeDocketEntryId = await generateNoticeOfDocketChangePdf({
      applicationContext,
      docketChangeInfo,
    });

    let noticeUpdatedDocketEntry = new DocketEntry(
      {
        ...NOTICE_OF_DOCKET_CHANGE,
        docketEntryId: noticeDocketEntryId,
        documentTitle: replaceBracketed(
          NOTICE_OF_DOCKET_CHANGE.documentTitle,
          docketChangeInfo.docketEntryIndex,
        ),
        isFileAttached: true,
        isOnDocketRecord: true,
        processingStatus: DOCUMENT_PROCESSING_STATUS_OPTIONS.COMPLETE,
        userId: user.userId,
      },
      { applicationContext },
    );

    noticeUpdatedDocketEntry.numberOfPages = await applicationContext
      .getUseCaseHelpers()
      .countPagesInDocument({
        applicationContext,
        docketEntryId: noticeUpdatedDocketEntry.docketEntryId,
      });

    noticeUpdatedDocketEntry.setAsServed(servedParties.all);

    caseEntity.addDocketEntry(noticeUpdatedDocketEntry);

    const { Body: pdfData } = await applicationContext
      .getStorageClient()
      .getObject({
        Bucket: applicationContext.environment.documentsBucketName,
        Key: noticeUpdatedDocketEntry.docketEntryId,
      })
      .promise();

    const serviceStampDate = formatDateString(
      noticeUpdatedDocketEntry.servedAt,
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
      key: noticeUpdatedDocketEntry.docketEntryId,
    });

    await applicationContext.getUseCaseHelpers().sendServedPartiesEmails({
      applicationContext,
      caseEntity,
      docketEntryEntity: noticeUpdatedDocketEntry,
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
        key: paperServicePdfId,
        useTempBucket: true,
      });

      const {
        url,
      } = await applicationContext
        .getPersistenceGateway()
        .getDownloadPolicyUrl({
          applicationContext,
          key: paperServicePdfId,
          useTempBucket: true,
        });

      paperServicePdfUrl = url;
      paperServiceDocumentTitle = noticeUpdatedDocketEntry.documentTitle;
    }
  }

  await applicationContext.getPersistenceGateway().updateCase({
    applicationContext,
    caseToUpdate: caseEntity.validate().toRawObject(),
  });

  if (needsNewCoversheet) {
    await applicationContext.getUseCases().addCoversheetInteractor({
      applicationContext,
      docketEntryId,
      docketNumber: caseEntity.docketNumber,
    });
  }

  return {
    caseDetail: caseEntity.toRawObject(),
    paperServiceDocumentTitle,
    paperServiceParties: servedParties.paper,
    paperServicePdfUrl,
  };
};
