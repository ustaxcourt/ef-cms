import { Case, isLeadCase } from '@shared//business/entities/cases/Case';
import {
  ALLOWLIST_FEATURE_FLAGS,
  DOCUMENT_RELATIONSHIPS,
  DOCUMENT_SERVED_MESSAGES,
  INITIAL_DOCUMENT_TYPES,
  ROLES,
} from '@shared/business/entities/EntityConstants';
import { DocketEntry } from '@shared/business/entities/DocketEntry';
import {
  ROLE_PERMISSIONS,
  isAuthorized,
} from '@shared/authorization/authorizationClientService';
import { ServerApplicationContext } from '@web-api/applicationContext';
import { NotFoundError, UnauthorizedError } from '@web-api/errors/errors';
import { UnknownAuthUser } from '@shared/business/entities/authUser/AuthUser';
import { WorkItem } from '@shared/business/entities/WorkItem';
import { aggregatePartiesForService } from '@shared/business/utilities/aggregatePartiesForService';
import { upsertWorkItems } from '@web-api/persistence/postgres/workitems/upsertWorkItems';
import { getCasesByDocketNumbers } from '@web-api/persistence/postgres/cases/getCasesByDocketNumbers';
import {
  asyncHandleLockError,
  withLocking,
} from '@web-api/persistence/postgres/utils/mutex';
import { addDocketEntryToCase } from '@web-api/business/useCaseHelper/docketEntry/addDocketEntryToCase';
import { getUserById } from '@web-api/persistence/postgres/users/getUserById';
import { getUniqueId } from '@shared/sharedAppContext';
import {
  AllFeatureFlags,
  getAllFeatureFlagsInteractor,
} from '../featureFlag/getAllFeatureFlagsInteractor';

export const addPaperFiling = async (
  applicationContext: ServerApplicationContext,
  {
    clientConnectionId,
    consolidatedGroupDocketNumbers,
    documentStorageId,
    documentMetadata,
    isSavingForLater,
  }: {
    clientConnectionId: string;
    consolidatedGroupDocketNumbers: string[];
    documentMetadata: DocumentMetadata;
    isSavingForLater: boolean;
    documentStorageId: string;
  },
  authorizedUser: UnknownAuthUser,
) => {
  if (!isAuthorized(authorizedUser, ROLE_PERMISSIONS.DOCKET_ENTRY)) {
    throw new UnauthorizedError('Unauthorized');
  }

  if (!documentStorageId) {
    documentStorageId = getUniqueId();
  }

  const docketEntryId = documentStorageId;

  if (!documentMetadata) {
    throw new Error('Did not receive meta data for docket entry');
  }

  const featureFlags: AllFeatureFlags = await getAllFeatureFlagsInteractor(
    applicationContext,
    true,
  );

  const restrictedEventCodes =
    featureFlags[ALLOWLIST_FEATURE_FLAGS.RESTRICTED_EVENT_CODES.key];

  if (
    documentMetadata.eventCode &&
    typeof restrictedEventCodes === 'string' &&
    restrictedEventCodes.split(',').includes(documentMetadata.eventCode)
  ) {
    throw new UnauthorizedError('Unauthorized to edit this document type');
  }

  const { docketNumber: subjectCaseDocketNumber, isFileAttached } =
    documentMetadata;

  if (isSavingForLater) {
    consolidatedGroupDocketNumbers = [subjectCaseDocketNumber];
  } else {
    consolidatedGroupDocketNumbers = [
      subjectCaseDocketNumber,
      ...consolidatedGroupDocketNumbers,
    ];
  }

  const isReadyForService =
    documentMetadata.isFileAttached && !isSavingForLater;

  const docketRecordEditState =
    documentMetadata.isFileAttached === false ? documentMetadata : {};

  const user = await getUserById({ userId: authorizedUser.userId });

  if (!user) {
    throw new NotFoundError(
      `User not found with user id ${authorizedUser.userId}`,
    );
  }

  const caseEntities: Case[] = [];
  let filedByFromLeadCase;

  const consolidatedGroupCases = await getCasesByDocketNumbers({
    docketNumbers: consolidatedGroupDocketNumbers,
    excludeFields: ['docketEntries', 'correspondence', 'hearings'],
  });

  for (const rawCase of consolidatedGroupCases) {
    const caseEntity = new Case(rawCase, { authorizedUser });

    const docketEntryEntity = new DocketEntry(
      {
        ...documentMetadata,
        docketEntryId,
        documentStorageId,
        documentTitle: documentMetadata.documentTitle,
        documentType: documentMetadata.documentType,
        editState: JSON.stringify(docketRecordEditState),
        filingDate: documentMetadata.receivedAt,
        isOnDocketRecord: true,
        mailingDate: documentMetadata.mailingDate,
        relationship: DOCUMENT_RELATIONSHIPS.PRIMARY,
      },
      { authorizedUser, petitioners: caseEntity.petitioners },
    );

    docketEntryEntity.setFiledBy(user);

    const servedParties: any = aggregatePartiesForService(caseEntity);

    if (isLeadCase(caseEntity)) {
      filedByFromLeadCase = docketEntryEntity.filedBy;
    }

    if (filedByFromLeadCase) {
      docketEntryEntity.filedBy = filedByFromLeadCase;
    }

    const workItem = new WorkItem({
      assigneeId: user.userId,
      assigneeName: user.name,
      docketNumber: caseEntity.docketNumber,
      docketEntryId: docketEntryEntity.docketEntryId,
      inProgress: isSavingForLater,
      isRead: user.role !== ROLES.privatePractitioner,
      section: WorkItem.getWorkItemSectionFromUserSection({
        section: user.section,
        documentTitle: docketEntryEntity.documentTitle,
      }),
      sentBy: user.name,
      sentBySection: user.section,
      sentByUserId: user.userId,
    });

    if (isReadyForService) {
      workItem.setAsCompleted({
        message: 'completed',
        user,
      });

      docketEntryEntity.setAsServed(servedParties.all);
    }

    await saveWorkItemInternal({
      workItem,
    });

    if (isFileAttached) {
      docketEntryEntity.numberOfPages = await applicationContext
        .getUseCaseHelpers()
        .countPagesInDocument({
          applicationContext,
          documentStorageId,
          documentBytes: undefined,
        });
    }

    await addDocketEntryToCase({
      caseEntity,
      docketEntryEntity,
    });

    caseEntities.push(caseEntity);
  }

  let paperServicePdfUrl;

  if (isReadyForService) {
    const electronicParties =
      documentMetadata.eventCode ===
      INITIAL_DOCUMENT_TYPES.attachmentToPetition.eventCode
        ? []
        : undefined;

    const paperServiceResult = await applicationContext
      .getUseCaseHelpers()
      .serveDocumentAndGetPaperServicePdf({
        applicationContext,
        caseEntities,
        docketEntryId,
        electronicParties,
        stampedPdf: undefined,
      });

    paperServicePdfUrl = paperServiceResult && paperServiceResult.pdfUrl;
  }

  const successMessage =
    consolidatedGroupDocketNumbers.length > 1
      ? DOCUMENT_SERVED_MESSAGES.SELECTED_CASES
      : DOCUMENT_SERVED_MESSAGES.ENTRY_ADDED;

  await applicationContext.getNotificationGateway().sendNotificationToUser({
    applicationContext,
    clientConnectionId,
    message: {
      action: 'serve_document_complete',
      alertSuccess: {
        message: successMessage,
        overwritable: false,
      },
      docketEntryId,
      generateCoversheet: isReadyForService,
      pdfUrl: paperServicePdfUrl,
    },
    userId: user.userId,
  });
};

/**
 * Helper function to save any work items required when filing this docket entry
 * @param {object} providers  The providers Object
 * @param {object} providers.applicationContext The application Context
 * @param {boolean} providers.isSavingForLater Whether or not we are saving these work items for later
 * @param {object} providers.workItem The work item we are saving
 */
const saveWorkItemInternal = async ({ workItem }) => {
  const workItemRaw = workItem.validate().toRawObject();

  await upsertWorkItems({
    workItems: [workItemRaw],
  });
};

type DocumentMetadata = {
  docketNumber: string;
  isFileAttached: boolean;
  documentTitle: string;
  documentType: string;
  eventCode: string;
  filedBy: string;
  isPaper: boolean;
  receivedAt?: string;
  mailingDate?: string;
  category?: string;
};

export const determineEntitiesToLock = (
  _applicationContext: ServerApplicationContext,
  {
    consolidatedGroupDocketNumbers = [],
    documentMetadata,
  }: {
    consolidatedGroupDocketNumbers?: string[];
    documentMetadata: DocumentMetadata;
  },
) => ({
  identifiers: [
    ...new Set([
      ...consolidatedGroupDocketNumbers,
      documentMetadata?.docketNumber,
    ]),
  ].map(item => `case|${item}`),
  ttl: 900,
});

export const addPaperFilingInteractor = withLocking(
  addPaperFiling,
  determineEntitiesToLock,
  asyncHandleLockError,
);
