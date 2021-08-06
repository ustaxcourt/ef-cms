const {
  addServedStampToDocument,
} = require('../../useCases/courtIssuedDocument/addServedStampToDocument');
const {
  aggregatePartiesForService,
} = require('../../utilities/aggregatePartiesForService');
const {
  CONTACT_CHANGE_DOCUMENT_TYPES,
  DOCUMENT_RELATIONSHIPS,
  SYSTEM_GENERATED_DOCUMENT_TYPES,
} = require('../../entities/EntityConstants');
const {
  DOCKET_SECTION,
  DOCUMENT_PROCESSING_STATUS_OPTIONS,
} = require('../../entities/EntityConstants');
const {
  generateNoticeOfDocketChangePdf,
} = require('../../useCaseHelper/noticeOfDocketChange/generateNoticeOfDocketChangePdf');
const {
  getDocumentTitleWithAdditionalInfo,
} = require('../../utilities/getDocumentTitleWithAdditionalInfo');
const {
  isAuthorized,
  ROLE_PERMISSIONS,
} = require('../../../authorization/authorizationClientService');
const { Case } = require('../../entities/cases/Case');
const { CASE_CAPTION_POSTFIX } = require('../../entities/EntityConstants');
const { dateStringsCompared } = require('../../utilities/DateHandler');
const { DocketEntry } = require('../../entities/DocketEntry');
const { formatDateString } = require('../../utilities/DateHandler');
const { getCaseCaptionMeta } = require('../../utilities/getCaseCaptionMeta');
const { getDocumentTitle } = require('../../utilities/getDocumentTitle');
const { replaceBracketed } = require('../../utilities/replaceBracketed');
const { UnauthorizedError } = require('../../../errors/errors');

const getNeedsNewCoversheet = ({ currentDocketEntry, updatedDocketEntry }) => {
  const receivedAtUpdated =
    dateStringsCompared(
      currentDocketEntry.receivedAt,
      updatedDocketEntry.receivedAt,
    ) !== 0;
  const certificateOfServiceUpdated =
    currentDocketEntry.certificateOfService !==
    updatedDocketEntry.certificateOfService;
  const documentTitleUpdated =
    getDocumentTitleWithAdditionalInfo({ docketEntry: currentDocketEntry }) !==
    getDocumentTitleWithAdditionalInfo({ docketEntry: updatedDocketEntry });

  return (
    receivedAtUpdated || certificateOfServiceUpdated || documentTitleUpdated
  );
};

exports.getNeedsNewCoversheet = getNeedsNewCoversheet;

/**
 * completeDocketEntryQCInteractor
 *
 * @param {object} applicationContext the application context
 * @param {object} providers the providers object
 * @param {object} providers.entryMetadata the entry metadata
 * @returns {object} the updated case after the documents are added
 */
exports.completeDocketEntryQCInteractor = async (
  applicationContext,
  { entryMetadata },
) => {
  const authorizedUser = applicationContext.getCurrentUser();

  const { PDFDocument } = await applicationContext.getPdfLib();

  if (!isAuthorized(authorizedUser, ROLE_PERMISSIONS.DOCKET_ENTRY)) {
    throw new UnauthorizedError('Unauthorized');
  }

  const { docketEntryId, docketNumber, overridePaperServiceAddress } =
    entryMetadata;

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
    filedBy: entryMetadata.filedBy,
    filers: entryMetadata.filers,
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
    pending: entryMetadata.pending,
    receivedAt: entryMetadata.receivedAt,
    scenario: entryMetadata.scenario,
    serviceDate: entryMetadata.serviceDate,
  };

  const updatedDocketEntry = new DocketEntry(
    {
      ...currentDocketEntry,
      ...editableFields,
      documentTitle: editableFields.documentTitle,
      editState: '{}',
      relationship: DOCUMENT_RELATIONSHIPS.PRIMARY,
      userId: user.userId,
    },
    { applicationContext, petitioners: caseToUpdate.petitioners },
  ).validate();
  updatedDocketEntry.setQCed(user);

  let updatedDocumentTitle = getDocumentTitle({
    applicationContext,
    docketEntry: updatedDocketEntry,
  });

  let currentDocumentTitle = getDocumentTitle({
    applicationContext,
    docketEntry: currentDocketEntry,
  });

  const needsNewCoversheet = getNeedsNewCoversheet({
    currentDocketEntry,
    updatedDocketEntry,
  });

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

  caseEntity = await applicationContext
    .getUseCaseHelpers()
    .updateCaseAutomaticBlock({ applicationContext, caseEntity });

  const workItemToUpdate = updatedDocketEntry.workItem;

  if (workItemToUpdate) {
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

      const { url } = await applicationContext
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
        ...SYSTEM_GENERATED_DOCUMENT_TYPES.noticeOfDocketChange,
        docketEntryId: noticeDocketEntryId,
        documentTitle: replaceBracketed(
          SYSTEM_GENERATED_DOCUMENT_TYPES.noticeOfDocketChange.documentTitle,
          docketChangeInfo.docketEntryIndex,
        ),
        isFileAttached: true,
        isOnDocketRecord: true,
        processingStatus: DOCUMENT_PROCESSING_STATUS_OPTIONS.COMPLETE,
        userId: user.userId,
      },
      { applicationContext, petitioners: caseToUpdate.petitioners },
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

    const paperServiceResult = await applicationContext
      .getUseCaseHelpers()
      .serveDocumentAndGetPaperServicePdf({
        applicationContext,
        caseEntity,
        docketEntryId: noticeUpdatedDocketEntry.docketEntryId,
      });

    if (servedParties.paper.length > 0) {
      paperServicePdfUrl = paperServiceResult && paperServiceResult.pdfUrl;
      paperServiceDocumentTitle = noticeUpdatedDocketEntry.documentTitle;
    }
  }

  await applicationContext.getUseCaseHelpers().updateCaseAndAssociations({
    applicationContext,
    caseToUpdate: caseEntity,
  });

  if (needsNewCoversheet) {
    await applicationContext
      .getUseCases()
      .addCoversheetInteractor(applicationContext, {
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
