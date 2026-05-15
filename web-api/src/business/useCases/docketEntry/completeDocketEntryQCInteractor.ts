/* eslint-disable complexity */
import {
  CONTACT_CHANGE_DOCUMENT_TYPES,
  DOCUMENT_PROCESSING_STATUS_OPTIONS,
  SYSTEM_GENERATED_DOCUMENT_TYPES,
} from '@shared/business/entities/EntityConstants';
import { Case } from '@shared/business/entities/cases/Case';
import { DocketEntry } from '@shared/business/entities/DocketEntry';
import {
  FORMATS,
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
import { RawUser, User } from '@shared/business/entities/User';
import { addServedStampToDocument } from '@web-api/business/useCases/courtIssuedDocument/addServedStampToDocument';
import { aggregatePartiesForService } from '@shared/business/utilities/aggregatePartiesForService';
import { generateNoticeOfDocketChangePdf } from '@web-api/business/useCaseHelper/noticeOfDocketChange/generateNoticeOfDocketChangePdf';
import { getCaseCaptionMeta } from '@shared/business/utilities/getCaseCaptionMeta';
import { getDocumentTitleForNoticeOfChange } from '@web-api/business/utilities/getDocumentTitleForNoticeOfChange';
import { replaceBracketed } from '@shared/business/utilities/replaceBracketed';
import { upsertWorkItems } from '@web-api/persistence/postgres/workitems/upsertWorkItems';
import { getFeatureFlagValues } from '@web-api/persistence/postgres/featureFlag/getFeatureFlagValues';
import { getUserById } from '@web-api/persistence/postgres/users/getUserById';
import { getWorkItemByDocketNumberAndDocketEntryId } from '@web-api/persistence/postgres/workitems/getWorkItemByDocketNumberAndDocketEntryId';
import { updateCaseAndAssociations } from '@web-api/business/useCaseHelper/caseAssociation/updateCaseAndAssociations';
import { withLocking } from '@web-api/persistence/postgres/utils/mutex';
import { WorkItem } from '@shared/business/entities/WorkItem';
import { getCasesByDocketNumbers } from '@web-api/persistence/postgres/cases/getCasesByDocketNumbers';
import { ConsolidatedCaseSummary } from '@shared/business/dto/cases/ConsolidatedCaseSummary';
import {
  buildUpdatedDocketEntry,
  needsNewCoversheet,
} from '@web-api/business/useCaseHelper/docketEntry/noticeOfDocketChangeHelper';
import { settlePromises } from '@web-api/utilities/settlePromises';
import { countPagesInDocument } from '@web-api/business/useCaseHelper/countPagesInDocument';
import { withTransaction } from '@web-api/persistence/postgres/utils/transactions';

type CompleteDocketEntryQCEntryMetadata = Pick<
  DocketEntry,
  | 'addToCoversheet'
  | 'additionalInfo'
  | 'additionalInfo2'
  | 'attachments'
  | 'certificateOfService'
  | 'certificateOfServiceDate'
  | 'documentTitle'
  | 'documentType'
  | 'eventCode'
  | 'filedBy'
  | 'filers'
  | 'freeText'
  | 'hasOtherFilingParty'
  | 'lodged'
  | 'mailingDate'
  | 'objections'
  | 'ordinalValue'
  | 'otherFilingParty'
  | 'otherIteration'
  | 'partyIrsPractitioner'
  | 'pending'
  | 'previousDocument'
  | 'receivedAt'
  | 'scenario'
  | 'secondaryDocument'
  | 'serviceDate'
  | 'docketEntryId'
  | 'docketNumber'
  | 'isFileAttached'
  | 'multiDocketedOn'
  | 'originallyFiledDocketNumber'
> & {
  selectedSection?: string;
};

const completeDocketEntryQC = async (
  applicationContext: ServerApplicationContext,
  { entryMetadata }: { entryMetadata: CompleteDocketEntryQCEntryMetadata },
  authorizedUser: UnknownAuthUser,
): Promise<{
  paperServiceParties: Array<RawUser & { docketNumber: string }>;
  paperServicePdfUrl: string | undefined;
  paperServiceDocumentTitle: string | undefined;
}> => {
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

  const {
    docketEntryId,
    docketNumber,
    selectedSection,
    multiDocketedOn,
    originallyFiledDocketNumber,
  } = entryMetadata;

  const docketNumbers = multiDocketedOn?.length
    ? multiDocketedOn
    : [docketNumber];

  const allCases = await getCasesByDocketNumbers({
    docketNumbers,
  });

  type CaseWithWorkItem = {
    currentCase: Case;
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

      const thisCase = new Case(aCase, {
        authorizedUser,
      });

      return { currentCase: thisCase, currentWorkItem: workItem };
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

  let originalFilingCaseNoticeDocumentTitle;
  let isNewCoverSheetNeeded = false;
  let paperServicePdfUrl: string | undefined = undefined;
  let paperServiceDocumentTitle: string | undefined = undefined;

  const paperServiceParties: Array<RawUser & { docketNumber: string }> = [];
  const caseSpecificNotices: Array<{
    caseEntity: Case;
    docketEntryId: string;
  }> = [];
  const updatePersistencePromises: Promise<any>[] = [];

  const cannotUseOriginalFilingCase = !multiDocketedOn.includes(
    originallyFiledDocketNumber!,
  );

  for (const caseWithWorkItem of casesWithWorkItems) {
    const { currentCase, currentWorkItem } = caseWithWorkItem;

    const currentDocketEntry = currentCase.getDocketEntryById({
      docketEntryId,
    })!;

    const updatedDocketEntry = buildUpdatedDocketEntry({
      authorizedUser,
      docketEntry: currentDocketEntry,
      editableFields,
      petitioners: currentCase.petitioners,
    });

    if (
      currentDocketEntry.originallyFiledDocketNumber ===
        currentDocketEntry.docketNumber ||
      cannotUseOriginalFilingCase
    ) {
      isNewCoverSheetNeeded = needsNewCoversheet({
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

    const docketEntryIndex: number = currentDocketEntry.index!;

    const { caseCaptionExtension, caseTitle } = getCaseCaptionMeta(currentCase);

    const docketChangeInfo = {
      caseCaptionExtension,
      caseTitle,
      docketEntryIndex,
      docketNumber: Case.getDocketNumberWithSuffix({
        docketNumber: currentCase.docketNumber,
        docketNumberSuffix: currentCase.docketNumberSuffix,
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

    currentCase.updateDocketEntry(updatedDocketEntry);

    await applicationContext
      .getUseCaseHelpers()
      .updateCaseAutomaticBlock({ caseEntity: currentCase });

    currentWorkItem.setAsCompleted({
      message: 'completed',
      user,
    });

    currentWorkItem.assignToUser({
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

    updatePersistencePromises.push(
      upsertWorkItems({
        workItems: [currentWorkItem.validate().toRawObject()],
      }),
    );

    const servedParties = aggregatePartiesForService(currentCase);

    servedParties.paper?.forEach(sp => {
      paperServiceParties.push({
        ...sp,
        docketNumber: currentCase.docketNumber,
      });
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
            caseEntity: currentCase,
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

        paperServicePdfUrl = url;
        paperServiceDocumentTitle = updatedDocketEntry.documentTitle;
      }
    } else if (needsNoticeOfDocketChange) {
      const noticeDocumentStorageId = await generateNoticeOfDocketChangePdf({
        applicationContext,
        authorizedUser,
        docketChangeInfo,
      });

      const noticeUpdatedDocketEntry = new DocketEntry(
        {
          ...SYSTEM_GENERATED_DOCUMENT_TYPES.noticeOfDocketChange,
          docketEntryId: noticeDocumentStorageId,
          documentStorageId: noticeDocumentStorageId,
          documentTitle: replaceBracketed(
            SYSTEM_GENERATED_DOCUMENT_TYPES.noticeOfDocketChange.documentTitle,
            docketChangeInfo.docketEntryIndex.toString(),
          ),
          isFileAttached: true,
          isOnDocketRecord: true,
          processingStatus: DOCUMENT_PROCESSING_STATUS_OPTIONS.COMPLETE,
        },
        { authorizedUser, petitioners: currentCase.petitioners },
      );

      noticeUpdatedDocketEntry.setFiledBy(user);

      noticeUpdatedDocketEntry.numberOfPages = await countPagesInDocument({
        applicationContext,
        documentStorageId: noticeUpdatedDocketEntry.documentStorageId,
      });

      noticeUpdatedDocketEntry.setOriginallyFiledDocketNumber(
        currentCase.docketNumber,
      );

      noticeUpdatedDocketEntry.setAsServed(servedParties.all);

      currentCase.addDocketEntry(noticeUpdatedDocketEntry);

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

      caseSpecificNotices.push({
        caseEntity: currentCase,
        docketEntryId: noticeUpdatedDocketEntry.docketEntryId,
      });

      if (
        currentDocketEntry.originallyFiledDocketNumber ===
          currentDocketEntry.docketNumber ||
        cannotUseOriginalFilingCase
      ) {
        originalFilingCaseNoticeDocumentTitle =
          noticeUpdatedDocketEntry.documentTitle;
      }
    }

    updatePersistencePromises.push(
      updateCaseAndAssociations({
        authorizedUser,
        caseToUpdate: currentCase,
      }),
    );
  }

  if (caseSpecificNotices.length > 0) {
    const paperServiceResult = await applicationContext
      .getUseCaseHelpers()
      .serveDocumentAndGetPaperServicePdf({
        applicationContext,
        caseEntities: caseSpecificNotices.map(n => n.caseEntity),
        docketEntryId: caseSpecificNotices[0].docketEntryId,
        caseSpecificDocketEntries: caseSpecificNotices,
      });

    if (paperServiceParties.length > 0) {
      paperServicePdfUrl = paperServiceResult && paperServiceResult.pdfUrl;
      paperServiceDocumentTitle = originalFilingCaseNoticeDocumentTitle;
    }
  }

  await withTransaction(async () => {
    await settlePromises(updatePersistencePromises);
  });

  if (isNewCoverSheetNeeded) {
    await applicationContext.getUseCases().addCoversheetInteractor(
      applicationContext,
      {
        docketEntryId,
        docketNumber,
      },
      authorizedUser,
    );
  }

  const { currentCase: filingCase } = casesWithWorkItems.find(
    caseWithWorkItem => {
      return caseWithWorkItem.currentCase.docketNumber === docketNumber;
    },
  )!;

  filingCase.consolidatedCases = casesWithWorkItems.map(
    caseWithWorkItem =>
      new ConsolidatedCaseSummary(caseWithWorkItem.currentCase),
  );

  return {
    paperServiceDocumentTitle,
    paperServiceParties,
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