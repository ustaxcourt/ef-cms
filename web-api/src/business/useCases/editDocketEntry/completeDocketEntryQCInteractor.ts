import {
  CONTACT_CHANGE_DOCUMENT_TYPES,
  DOCUMENT_PROCESSING_STATUS_OPTIONS,
  DOCUMENT_RELATIONSHIPS,
  SYSTEM_GENERATED_DOCUMENT_TYPES,
} from '../../../../../shared/src/business/entities/EntityConstants';
import { Case } from '../../../../../shared/src/business/entities/cases/Case';
import { DocketEntry } from '../../../../../shared/src/business/entities/DocketEntry';
import {
  FORMATS,
  dateStringsCompared,
  formatDateString,
} from '../../../../../shared/src/business/utilities/DateHandler';
import { InvalidRequest, UnauthorizedError } from '@web-api/errors/errors';
import {
  ROLE_PERMISSIONS,
  isAuthorized,
} from '../../../../../shared/src/authorization/authorizationClientService';
import { ServerApplicationContext } from '@web-api/applicationContext';
import { User } from '@shared/business/entities/User';
import { addServedStampToDocument } from '@web-api/business/useCases/courtIssuedDocument/addServedStampToDocument';
import { aggregatePartiesForService } from '@shared/business/utilities/aggregatePartiesForService';
import { generateNoticeOfDocketChangePdf } from '@web-api/business/useCaseHelper/noticeOfDocketChange/generateNoticeOfDocketChangePdf';
import { getCaseCaptionMeta } from '@shared/business/utilities/getCaseCaptionMeta';
import { getDocumentTitleForNoticeOfChange } from '@shared/business/utilities/getDocumentTitleForNoticeOfChange';
import { replaceBracketed } from '@shared/business/utilities/replaceBracketed';
import { withLocking } from '@web-api/business/useCaseHelper/acquireLock';

const completeDocketEntryQC = async (
  applicationContext: ServerApplicationContext,
  { entryMetadata }: { entryMetadata: any },
) => {
  const authorizedUser = applicationContext.getCurrentUser();

  const { PDFDocument } = await applicationContext.getPdfLib();

  if (!isAuthorized(authorizedUser, ROLE_PERMISSIONS.DOCKET_ENTRY)) {
    throw new UnauthorizedError('Unauthorized');
  }

  const {
    docketEntryId,
    docketNumber,
    leadDocketNumber,
    overridePaperServiceAddress,
    selectedSection,
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

  if (currentDocketEntry.workItem.isCompleted()) {
    throw new InvalidRequest('The work item was already completed');
  }

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
    otherIteration: entryMetadata.otherIteration,
    partyIrsPractitioner: entryMetadata.partyIrsPractitioner,
    pending: entryMetadata.pending,
    receivedAt: entryMetadata.receivedAt,
    scenario: entryMetadata.scenario,
    secondaryDocument: entryMetadata.secondaryDocument,
    serviceDate: entryMetadata.serviceDate,
  };

  const updatedDocketEntry = new DocketEntry(
    {
      ...currentDocketEntry,
      ...editableFields,
      documentTitle: editableFields.documentTitle,
      editState: '{}',
      relationship: DOCUMENT_RELATIONSHIPS.PRIMARY,
      workItem: {
        ...currentDocketEntry.workItem,
        leadDocketNumber,
        trialDate: caseEntity.trialDate,
        trialLocation: caseEntity.trialLocation,
      },
    },
    { applicationContext, petitioners: caseToUpdate.petitioners },
  ).validate();
  updatedDocketEntry.setQCed(user);

  let updatedDocumentTitle = getDocumentTitleForNoticeOfChange({
    applicationContext,
    docketEntry: updatedDocketEntry,
  });

  let currentDocumentTitle = getDocumentTitleForNoticeOfChange({
    applicationContext,
    docketEntry: currentDocketEntry,
  });

  const isNewCoverSheetNeeded = needsNewCoversheet({
    applicationContext,
    currentDocketEntry,
    updatedDocketEntry,
  });

  const needsNoticeOfDocketChange =
    updatedDocketEntry.filedBy !== currentDocketEntry.filedBy ||
    updatedDocumentTitle !== currentDocumentTitle;

  const { caseCaptionExtension, caseTitle } = getCaseCaptionMeta(caseEntity);

  const { name, title } = await applicationContext
    .getPersistenceGateway()
    .getConfigurationItemValue({
      applicationContext,
      configurationItemKey:
        applicationContext.getConstants().CLERK_OF_THE_COURT_CONFIGURATION,
    });

  const docketChangeInfo = {
    caseCaptionExtension,
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
    nameOfClerk: name,
    titleOfClerk: title,
  };

  caseEntity.updateDocketEntry(updatedDocketEntry);

  caseEntity = await applicationContext
    .getUseCaseHelpers()
    .updateCaseAutomaticBlock({ applicationContext, caseEntity });

  const workItemToUpdate = updatedDocketEntry.workItem;

  Object.assign(workItemToUpdate, {
    docketEntry: {
      ...updatedDocketEntry.toRawObject(),
      createdAt: updatedDocketEntry.createdAt,
    },
  });

  workItemToUpdate.setAsCompleted({
    message: 'completed',
    user,
  });

  const userIsCaseServices = User.isCaseServicesUser({
    section: user.section || '',
  });

  let sectionToAssignTo =
    userIsCaseServices && selectedSection ? selectedSection : user.section;

  workItemToUpdate.assignToUser({
    assigneeId: user.userId,
    assigneeName: user.name,
    section: sectionToAssignTo,
    sentBy: user.name,
    sentBySection: user.section,
    sentByUserId: user.userId,
  });

  await applicationContext
    .getPersistenceGateway()
    .saveWorkItemForDocketClerkFilingExternalDocument({
      applicationContext,
      workItem: workItemToUpdate.validate().toRawObject(),
    });

  let servedParties = aggregatePartiesForService(caseEntity);
  let paperServicePdfUrl;
  let paperServiceDocumentTitle;

  if (
    overridePaperServiceAddress ||
    CONTACT_CHANGE_DOCUMENT_TYPES.includes(updatedDocketEntry.documentType)
  ) {
    if (servedParties.paper.length > 0) {
      const pdfData = await applicationContext
        .getPersistenceGateway()
        .getDocument({
          applicationContext,
          key: updatedDocketEntry.docketEntryId,
        });

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
      },
      { applicationContext, petitioners: caseToUpdate.petitioners },
    );

    noticeUpdatedDocketEntry.setFiledBy(user);

    noticeUpdatedDocketEntry.numberOfPages = await applicationContext
      .getUseCaseHelpers()
      .countPagesInDocument({
        applicationContext,
        docketEntryId: noticeUpdatedDocketEntry.docketEntryId,
      });

    noticeUpdatedDocketEntry.setAsServed(servedParties.all);

    caseEntity.addDocketEntry(noticeUpdatedDocketEntry);

    const serviceStampDate = formatDateString(
      noticeUpdatedDocketEntry.servedAt!,
      FORMATS.MMDDYY,
    );

    const pdfData = await applicationContext
      .getPersistenceGateway()
      .getDocument({
        applicationContext,
        key: noticeUpdatedDocketEntry.docketEntryId,
      });

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
        caseEntities: [caseEntity],
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

  if (isNewCoverSheetNeeded) {
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

export const completeDocketEntryQCInteractor = withLocking(
  completeDocketEntryQC,
  (_applicationContext: ServerApplicationContext, { entryMetadata }) => ({
    identifiers: [`docket-entry|${entryMetadata.docketEntryId}`],
  }),
  new InvalidRequest('The document is currently being updated'),
);

export const needsNewCoversheet = ({
  applicationContext,
  currentDocketEntry,
  updatedDocketEntry,
}) => {
  const receivedAtUpdated =
    dateStringsCompared(
      currentDocketEntry.receivedAt,
      updatedDocketEntry.receivedAt,
    ) !== 0;
  const certificateOfServiceUpdated =
    currentDocketEntry.certificateOfService !==
    updatedDocketEntry.certificateOfService;
  const documentTitleUpdated =
    applicationContext.getUtilities().getDocumentTitleWithAdditionalInfo({
      docketEntry: currentDocketEntry,
    }) !==
    applicationContext.getUtilities().getDocumentTitleWithAdditionalInfo({
      docketEntry: updatedDocketEntry,
    });

  return (
    receivedAtUpdated || certificateOfServiceUpdated || documentTitleUpdated
  );
};
