import {
  Case,
  isLeadCase,
} from '../../../../../shared/src/business/entities/cases/Case';
import {
  DOCUMENT_RELATIONSHIPS,
  DOCUMENT_SERVED_MESSAGES,
  ROLES,
} from '../../../../../shared/src/business/entities/EntityConstants';
import { DocketEntry } from '../../../../../shared/src/business/entities/DocketEntry';
import {
  ROLE_PERMISSIONS,
  isAuthorized,
} from '../../../../../shared/src/authorization/authorizationClientService';
import { ServerApplicationContext } from '@web-api/applicationContext';
import { UnauthorizedError } from '@web-api/errors/errors';
import { UnknownAuthUser } from '@shared/business/entities/authUser/AuthUser';
import { WorkItem } from '../../../../../shared/src/business/entities/WorkItem';
import { aggregatePartiesForService } from '../../../../../shared/src/business/utilities/aggregatePartiesForService';
import { withLocking } from '@web-api/business/useCaseHelper/acquireLock';
import { saveWorkItem } from '@web-api/persistence/postgres/workitems/saveWorkItem';

export const addPaperFiling = async (
  applicationContext: ServerApplicationContext,
  {
    clientConnectionId,
    consolidatedGroupDocketNumbers,
    docketEntryId,
    documentMetadata,
    isSavingForLater,
  }: {
    clientConnectionId: string;
    consolidatedGroupDocketNumbers: string[];
    documentMetadata: DocumentMetadata;
    isSavingForLater: boolean;
    docketEntryId: string;
  },
  authorizedUser: UnknownAuthUser,
) => {
  if (!isAuthorized(authorizedUser, ROLE_PERMISSIONS.DOCKET_ENTRY)) {
    throw new UnauthorizedError('Unauthorized');
  }

  if (!docketEntryId) {
    throw new Error('Did not receive a docketEntryId');
  }

  if (!documentMetadata) {
    throw new Error('Did not receive meta data for docket entry');
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

  const user = await applicationContext
    .getPersistenceGateway()
    .getUserById({ applicationContext, userId: authorizedUser.userId });

  let caseEntities: Case[] = [];
  let filedByFromLeadCase;

  for (const docketNumber of consolidatedGroupDocketNumbers) {
    const rawCase = await applicationContext
      .getPersistenceGateway()
      .getCaseByDocketNumber({
        applicationContext,
        docketNumber,
      });

    let caseEntity = new Case(rawCase, { authorizedUser });

    const docketEntryEntity = new DocketEntry(
      {
        ...documentMetadata,
        docketEntryId,
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

    const workItem = new WorkItem(
      {
        assigneeId: user.userId,
        assigneeName: user.name,
        associatedJudge: caseEntity.associatedJudge,
        associatedJudgeId: caseEntity.associatedJudgeId,
        caseStatus: caseEntity.status,
        caseTitle: Case.getCaseTitle(caseEntity.caseCaption),
        docketEntry: {
          ...docketEntryEntity.toRawObject(),
          createdAt: docketEntryEntity.createdAt,
        },
        docketNumber: caseEntity.docketNumber,
        docketNumberWithSuffix: caseEntity.docketNumberWithSuffix,
        inProgress: isSavingForLater,
        isRead: user.role !== ROLES.privatePractitioner,
        section: user.section,
        sentBy: user.name,
        sentBySection: user.section,
        sentByUserId: user.userId,
        trialDate: caseEntity.trialDate,
        trialLocation: caseEntity.trialLocation,
      },
      { caseEntity },
    );

    if (isReadyForService) {
      workItem.setAsCompleted({
        message: 'completed',
        user,
      });

      docketEntryEntity.setAsServed(servedParties.all);
    }

    await saveWorkItemInternal({
      applicationContext,
      isReadyForService,
      workItem,
    });

    docketEntryEntity.setWorkItem(workItem);

    if (isFileAttached) {
      docketEntryEntity.numberOfPages = await applicationContext
        .getUseCaseHelpers()
        .countPagesInDocument({
          applicationContext,
          docketEntryId,
          documentBytes: undefined,
        });
    }

    caseEntity.addDocketEntry(docketEntryEntity);

    caseEntity = await applicationContext
      .getUseCaseHelpers()
      .updateCaseAutomaticBlock({
        applicationContext,
        caseEntity,
      });

    caseEntities.push(caseEntity);

    await applicationContext.getUseCaseHelpers().updateCaseAndAssociations({
      applicationContext,
      authorizedUser,
      caseToUpdate: caseEntity.validate().toRawObject(),
    });
  }

  let paperServicePdfUrl;

  if (isReadyForService) {
    const currentDocketEntry = caseEntities[0].getDocketEntryById({
      docketEntryId,
    });
    const electronicParties =
      currentDocketEntry.eventCode === 'ATP' ? [] : undefined;

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
const saveWorkItemInternal = async ({
  applicationContext,
  isReadyForService,
  workItem,
}) => {
  const workItemRaw = workItem.validate().toRawObject();

  if (isReadyForService) {
    await applicationContext.getPersistenceGateway().putWorkItemInUsersOutbox({
      applicationContext,
      section: workItem.section,
      userId: workItem.assigneeId,
      workItem: workItemRaw,
    });
  }

  await saveWorkItem({
    workItem: workItemRaw,
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

export const handleLockError = async (
  applicationContext,
  originalRequest,
  authorizedUser: UnknownAuthUser,
) => {
  if (authorizedUser?.userId) {
    await applicationContext.getNotificationGateway().sendNotificationToUser({
      applicationContext,
      clientConnectionId: originalRequest.clientConnectionId,
      message: {
        action: 'retry_async_request',
        originalRequest,
        requestToRetry: 'add_paper_filing',
      },
      userId: authorizedUser.userId,
    });
  }
};

export const addPaperFilingInteractor = withLocking(
  addPaperFiling,
  determineEntitiesToLock,
  handleLockError,
);
