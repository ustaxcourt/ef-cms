import {
  CONTACT_CHANGE_DOCUMENT_TYPES,
  DOCUMENT_PROCESSING_STATUS_OPTIONS,
  DOCUMENT_RELATIONSHIPS,
  SYSTEM_GENERATED_DOCUMENT_TYPES,
} from '@shared/business/entities/EntityConstants';
import { Case } from '@shared/business/entities/cases/Case';
import { DocketEntry } from '@shared/business/entities/DocketEntry';
import {
  FORMATS,
  dateStringsCompared,
  formatDateString,
} from '@shared/business/utilities/DateHandler';
import {
  InvalidRequest,
  NotFoundError,
  UnauthorizedError,
} from '@web-api/errors/errors';
import {
  ROLE_PERMISSIONS,
  isAuthorized,
} from '@shared/authorization/authorizationClientService';
import { ServerApplicationContext } from '@web-api/applicationContext';
import { UnknownAuthUser } from '@shared/business/entities/authUser/AuthUser';
import { User } from '@shared/business/entities/User';
import { addServedStampToDocument } from '@web-api/business/useCases/courtIssuedDocument/addServedStampToDocument';
import { aggregatePartiesForService } from '@shared/business/utilities/aggregatePartiesForService';
import { generateNoticeOfDocketChangePdf } from '@web-api/business/useCaseHelper/noticeOfDocketChange/generateNoticeOfDocketChangePdf';
import { getCaseByDocketNumber } from '@web-api/persistence/postgres/cases/getCaseByDocketNumber';
import { getCaseCaptionMeta } from '@shared/business/utilities/getCaseCaptionMeta';
import { getDocumentTitleForNoticeOfChange } from '@shared/business/utilities/getDocumentTitleForNoticeOfChange';
import { replaceBracketed } from '@shared/business/utilities/replaceBracketed';
import { upsertWorkItems } from '@web-api/persistence/postgres/workitems/upsertWorkItems';
import { getFeatureFlagValues } from '@web-api/persistence/postgres/featureFlag/getFeatureFlagValues';
import { getUserById } from '@web-api/persistence/postgres/users/getUserById';
import { getWorkItemByDocketNumberAndDocketEntryId } from '@web-api/persistence/postgres/workitems/getWorkItemByDocketNumberAndDocketEntryId';
import { updateCaseAndAssociations } from '@web-api/business/useCaseHelper/caseAssociation/updateCaseAndAssociations';
import { withLocking } from '@web-api/persistence/postgres/utils/mutex';
import { WorkItem } from '@shared/business/entities/WorkItem';
import { getCasesByDocketNumbers } from '@web-api/persistence/postgres/cases/getCasesByDocketNumbers';
import { buildUpdatedDocketEntry } from '@web-api/business/useCaseHelper/docketEntry/noticeOfDocketChangeHelper';

const completeDocketEntryQC = async (
  applicationContext: ServerApplicationContext,
  { entryMetadata }: { entryMetadata: any },
  authorizedUser: UnknownAuthUser,
) => {
  const { PDFDocument } = await applicationContext.getPdfLib();

  if (!isAuthorized(authorizedUser, ROLE_PERMISSIONS.DOCKET_ENTRY)) {
    throw new UnauthorizedError('Unauthorized');
  }

  const user = await getUserById({ userId: authorizedUser.userId });

  if (!user) {
    throw new NotFoundError(
      `User not found with user id ${authorizedUser.userId}`,
    );
  }

  const { docketEntryId, docketNumber, selectedSection, multiDocketedOn } =
    entryMetadata;

  const allCases = await getCasesByDocketNumbers({
    docketNumbers: multiDocketedOn ?? [entryMetadata.docketNumber],
  });

  type CaseWithWorkItem = Omit<RawCase, 'consolidatedCases'> & {
    currentWorkItem: WorkItem;
  };

  const casesWithWorkItems: CaseWithWorkItem[] = await Promise.all(
    allCases.map(async aCase => {
      const currentDocketEntry = aCase.docketEntries.find(
        docketEntry => docketEntry.docketEntryId === docketEntryId,
      );

      if (!currentDocketEntry) {
        throw new NotFoundError(
          `Could not find docket entry with id ${docketEntryId} on case ${aCase.docketNumber}`,
        );
      }

      const workItem = await getWorkItemByDocketNumberAndDocketEntryId({
        docketNumber: aCase.docketNumber,
        docketEntryId,
      });

      if (!workItem) {
        throw new NotFoundError(
          `Could not find work item associated with ${aCase.docketNumber} document ${docketEntryId}`,
        );
      } else if (workItem.isCompleted()) {
        throw new InvalidRequest(
          `The work item was already completed on case ${aCase.docketNumber}`,
        );
      }

      return { ...aCase, currentWorkItem: workItem };
    }),
  );

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
    previousDocument: entryMetadata.previousDocument,
    receivedAt: entryMetadata.receivedAt,
    scenario: entryMetadata.scenario,
    secondaryDocument: entryMetadata.secondaryDocument,
    serviceDate: entryMetadata.serviceDate,
  };

  let isNewCoverSheetNeeded = false;

  // potentially create helper method/abstract ff below
  const { CLERK_OF_THE_COURT_CONFIGURATION } =
    applicationContext.getConstants();

  const [CLERK_OF_THE_COURT_RECORD] = await getFeatureFlagValues([
    CLERK_OF_THE_COURT_CONFIGURATION,
  ]);

  const { name, title } = CLERK_OF_THE_COURT_RECORD.value.current as {
    name: string;
    title: string;
  };

  const userIsCaseServices = User.isCaseServicesUser({
    section: user.section || '',
  });

  const sectionToAssignTo =
    userIsCaseServices && selectedSection ? selectedSection : user.section;

  // create one large paper service pdf (use 'old' interactor)
  let paperServicePdfUrl;
  let paperServiceDocumentTitle;
  const paperServiceParties = new Set();

  for (const caseWithWorkItem of casesWithWorkItems) {
    let caseEntity = new Case(caseWithWorkItem, {
      authorizedUser,
    });

    const workItemEntity = caseWithWorkItem.currentWorkItem;

    const currentDocketEntry = caseEntity.getDocketEntryById({
      docketEntryId,
    })!;

    const updatedDocketEntry = buildUpdatedDocketEntry({
      authorizedUser,
      docketEntry: currentDocketEntry,
      editableFields,
      petitioners: caseEntity.petitioners,
    });

    if (
      !currentDocketEntry.multiDocketedOriginalDocketNumber ||
      currentDocketEntry.multiDocketedOriginalDocketNumber ===
        currentDocketEntry.docketNumber
    ) {
      isNewCoverSheetNeeded = needsNewCoversheet({
        applicationContext,
        currentDocketEntry,
        updatedDocketEntry,
      });
    }

    const updatedDocumentTitle = getDocumentTitleForNoticeOfChange({
      applicationContext,
      docketEntry: updatedDocketEntry,
    });

    const currentDocumentTitle = getDocumentTitleForNoticeOfChange({
      applicationContext,
      docketEntry: currentDocketEntry,
    });

    const needsNoticeOfDocketChange =
      currentDocketEntry.filedBy !== updatedDocketEntry.filedBy ||
      updatedDocumentTitle !== currentDocumentTitle;

    const { index: docketEntryIndex } = currentDocketEntry;

    const { caseCaptionExtension, caseTitle } = getCaseCaptionMeta(caseEntity);

    const docketChangeInfo = {
      caseCaptionExtension,
      caseTitle,
      docketEntryIndex,
      docketNumber: Case.getDocketNumberWithSuffix({
        docketNumber: caseEntity.docketNumber,
        docketNumberSuffix: caseEntity.docketNumberSuffix,
      }),
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
      .updateCaseAutomaticBlock({ caseEntity });

    workItemEntity.setAsCompleted({
      message: 'completed',
      user,
    });

    workItemEntity.assignToUser({
      assigneeId: user.userId,
      assigneeName: user.name,
      section: WorkItem.getWorkItemSectionFromUserSection({
        section: sectionToAssignTo,
        documentTitle: updatedDocketEntry.documentTitle,
      }),
      sentBy: user.name,
      sentBySection: user.section,
      sentByUserId: user.userId,
    });

    // extract for parallelization
    await upsertWorkItems({
      workItems: [workItemEntity.validate().toRawObject()],
    });

    const servedParties = aggregatePartiesForService(caseEntity);

    servedParties.paper?.forEach(sp => {
      paperServiceParties.add(sp);
    });

    if (
      CONTACT_CHANGE_DOCUMENT_TYPES.includes(updatedDocketEntry.documentType!)
    ) {
      if (servedParties.paper.length > 0) {
        const pdfData = await applicationContext
          .getPersistenceGateway()
          .getDocument({
            applicationContext,
            key: currentDocketEntry.documentStorageId,
          });

        const noticeDoc = await PDFDocument.load(pdfData);

        const newPdfDoc = await PDFDocument.create();

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

        await applicationContext
          .getPersistenceGateway()
          .saveDocumentFromLambda({
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

        // create one large paper service pdf (use 'old' interactor)
        paperServicePdfUrl = url;
        paperServiceDocumentTitle = updatedDocketEntry.documentTitle;
      }
    } else if (needsNoticeOfDocketChange) {
      const noticeDocumentStorageId = await generateNoticeOfDocketChangePdf({
        applicationContext,
        authorizedUser,
        // @ts-ignore
        docketChangeInfo,
      });

      const noticeUpdatedDocketEntry = new DocketEntry(
        {
          ...SYSTEM_GENERATED_DOCUMENT_TYPES.noticeOfDocketChange,
          docketEntryId: noticeDocumentStorageId,
          documentStorageId: noticeDocumentStorageId,
          documentTitle: replaceBracketed(
            SYSTEM_GENERATED_DOCUMENT_TYPES.noticeOfDocketChange.documentTitle,
            // @ts-ignore
            docketChangeInfo.docketEntryIndex,
          ),
          isFileAttached: true,
          isOnDocketRecord: true,
          processingStatus: DOCUMENT_PROCESSING_STATUS_OPTIONS.COMPLETE,
        },
        { authorizedUser, petitioners: caseEntity.petitioners },
      );

      noticeUpdatedDocketEntry.setFiledBy(user);

      noticeUpdatedDocketEntry.numberOfPages = await applicationContext
        .getUseCaseHelpers()
        .countPagesInDocument({
          applicationContext,
          documentStorageId: noticeUpdatedDocketEntry.documentStorageId,
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
          key: noticeUpdatedDocketEntry.documentStorageId,
        });

      const newPdfData = await addServedStampToDocument({
        applicationContext,
        pdfData,
        serviceStampText: `Served ${serviceStampDate}`,
      });

      await applicationContext.getPersistenceGateway().saveDocumentFromLambda({
        document: newPdfData,
        key: noticeUpdatedDocketEntry.documentStorageId,
      });

      // create one large paper service pdf (use 'old' interactor)
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

    // make sure to parallelize this
    await updateCaseAndAssociations({
      authorizedUser,
      caseToUpdate: caseEntity,
    });
  }

  const { pdfUrl } = await applicationContext
    .getUseCaseHelpers()
    .serveDocumentAndGetPaperServicePdf({
      applicationContext,
      caseEntities: caseSpecificNotices.map(n => n.caseEntity),
      docketEntryId: caseSpecificNotices[0].docketEntryId,
      caseSpecificDocketEntries: caseSpecificNotices,
    });

  if (isNewCoverSheetNeeded) {
    // which case's docketNumber to pass in here depends on whether addCoversheetInteractor is smart enough to handle adding coversheets to a consolidated group for a non-lead case
    await applicationContext.getUseCases().addCoversheetInteractor(
      applicationContext,
      {
        docketEntryId,
        docketNumber,
      },
      authorizedUser,
    );
  }

  return {
    caseDetail: caseEntity.toRawObject(),
    paperServiceDocumentTitle,
    paperServiceParties: Array.from(paperServiceParties),
    paperServicePdfUrl: pdfUrl,
  };
};

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
