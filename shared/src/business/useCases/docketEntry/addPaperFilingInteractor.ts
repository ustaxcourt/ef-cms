import {
  ALLOWLIST_FEATURE_FLAGS,
  DOCKET_SECTION,
  DOCUMENT_RELATIONSHIPS,
  ROLES,
} from '../../entities/EntityConstants';
import { Case, isLeadCase } from '../../entities/cases/Case';
import { DocketEntry } from '../../entities/DocketEntry';
import {
  ROLE_PERMISSIONS,
  isAuthorized,
} from '../../../authorization/authorizationClientService';
import { UnauthorizedError } from '../../../errors/errors';
import { WorkItem } from '../../entities/WorkItem';
import { aggregatePartiesForService } from '../../utilities/aggregatePartiesForService';
import { pick } from 'lodash';

/**
 *
 * @param {object} applicationContext the application context
 * @param {object} providers the providers object
 * @param {object} providers.clientConnectionId the client connection Id
 * @param {object} providers.consolidatedGroupDocketNumbers the docket numbers from the consolidated group
 * @param {object} providers.documentMetadata the document metadata
 * @param {boolean} providers.isSavingForLater flag for saving docket entry for later instead of serving it
 * @param {string} providers.primaryDocumentFileId the id of the document file
 * @returns {object} the updated case after the documents are added
 */
export const addPaperFilingInteractor = async (
  applicationContext: IApplicationContext,
  {
    clientConnectionId,
    consolidatedGroupDocketNumbers,
    documentMetadata,
    isSavingForLater,
    primaryDocumentFileId,
  }: {
    clientConnectionId: string;
    consolidatedGroupDocketNumbers: string[];
    documentMetadata: any;
    isSavingForLater: boolean;
    primaryDocumentFileId: string;
  },
) => {
  const authorizedUser = applicationContext.getCurrentUser();

  if (!isAuthorized(authorizedUser, ROLE_PERMISSIONS.DOCKET_ENTRY)) {
    throw new UnauthorizedError('Unauthorized');
  }

  if (!documentMetadata) {
    throw new Error('Did not receive meta data for docket entry');
  }

  const { docketNumber, isFileAttached } = documentMetadata;
  const user = await applicationContext
    .getPersistenceGateway()
    .getUserById({ applicationContext, userId: authorizedUser.userId });

  const isCaseConsolidationFeatureOn = await applicationContext
    .getUseCases()
    .getFeatureFlagValueInteractor(applicationContext, {
      featureFlag:
        ALLOWLIST_FEATURE_FLAGS.CONSOLIDATED_CASES_PROPAGATE_DOCKET_ENTRIES.key,
    });

  if (!isCaseConsolidationFeatureOn) {
    consolidatedGroupDocketNumbers = [docketNumber];
  }

  const caseToUpdate = await applicationContext
    .getPersistenceGateway()
    .getCaseByDocketNumber({
      applicationContext,
      docketNumber,
    });

  const baseMetadata = pick(documentMetadata, [
    'filers',
    'partyIrsPractitioner',
    'practitioner',
  ]);

  const [docketEntryId, metadata, relationship] = [
    primaryDocumentFileId,
    documentMetadata,
    DOCUMENT_RELATIONSHIPS.PRIMARY,
  ];

  const readyForService = metadata.isFileAttached && !isSavingForLater;

  if (!docketEntryId) {
    throw new Error('Did not receive a primaryDocumentFileId');
  }

  const docketRecordEditState =
    metadata.isFileAttached === false ? documentMetadata : {};

  let caseEntities = [];
  for (let docketNo of consolidatedGroupDocketNumbers) {
    const aCase = await applicationContext
      .getPersistenceGateway()
      .getCaseByDocketNumber({
        applicationContext,
        docketNumber: docketNo,
      });

    let aCaseEntity = new Case(aCase, { applicationContext });
    caseEntities.push(aCaseEntity);
  }

  let filedByFromLeadCase;
  let servedParties;
  for (const caseEntity of caseEntities) {
    servedParties = aggregatePartiesForService(caseEntity);

    const docketEntryEntity = new DocketEntry(
      {
        ...baseMetadata,
        ...metadata,
        docketEntryId,
        documentTitle: metadata.documentTitle,
        documentType: metadata.documentType,
        editState: JSON.stringify(docketRecordEditState),
        filingDate: metadata.receivedAt,
        isOnDocketRecord: true,
        mailingDate: metadata.mailingDate,
        relationship,
        userId: user.userId,
      },
      { applicationContext, petitioners: caseEntity.petitioners },
    );

    if (isLeadCase(caseEntity)) {
      filedByFromLeadCase = docketEntryEntity.filedBy;
    }

    if (filedByFromLeadCase) {
      docketEntryEntity.filedBy = filedByFromLeadCase;
    }

    const workItem = new WorkItem(
      {
        assigneeId: null,
        assigneeName: null,
        associatedJudge: caseToUpdate.associatedJudge,
        caseStatus: caseToUpdate.status,
        caseTitle: Case.getCaseTitle(caseEntity.caseCaption),
        docketEntry: {
          ...docketEntryEntity.toRawObject(),
          createdAt: docketEntryEntity.createdAt,
        },
        docketNumber: caseToUpdate.docketNumber,
        docketNumberWithSuffix: caseToUpdate.docketNumberWithSuffix,
        inProgress: isSavingForLater,
        isRead: user.role !== ROLES.privatePractitioner,
        leadDocketNumber: caseToUpdate.leadDocketNumber,
        section: DOCKET_SECTION,
        sentBy: user.name,
        sentByUserId: user.userId,
      },
      { applicationContext },
    );

    docketEntryEntity.setWorkItem(workItem);

    workItem.assignToUser({
      assigneeId: user.userId,
      assigneeName: user.name,
      section: user.section,
      sentBy: user.name,
      sentBySection: user.section,
      sentByUserId: user.userId,
    });

    if (readyForService) {
      docketEntryEntity.setAsServed(servedParties.all);
    }

    if (isFileAttached) {
      docketEntryEntity.numberOfPages = await applicationContext
        .getUseCaseHelpers()
        .countPagesInDocument({
          applicationContext,
          docketEntryId,
        });
    }

    caseEntity.addDocketEntry(docketEntryEntity);
    const aCaseEntity = await applicationContext
      .getUseCaseHelpers()
      .updateCaseAutomaticBlock({
        applicationContext,
        caseEntity,
      });

    await applicationContext.getUseCaseHelpers().updateCaseAndAssociations({
      applicationContext,
      caseToUpdate: aCaseEntity.validate().toRawObject(),
    });

    if (readyForService) {
      workItem.setAsCompleted({
        message: 'completed',
        user,
      });
    }

    await saveWorkItem({
      applicationContext,
      isSavingForLater,
      workItem,
    });
  }

  let paperServicePdfUrl;
  let paperServiceResult;

  if (readyForService) {
    paperServiceResult = await applicationContext
      .getUseCaseHelpers()
      .serveDocumentAndGetPaperServicePdf({
        applicationContext,
        caseEntities,
        docketEntryId,
      });

    if (servedParties.paper.length > 0) {
      paperServicePdfUrl = paperServiceResult && paperServiceResult.pdfUrl;
    }
  }

  const successMessage =
    consolidatedGroupDocketNumbers.length > 1
      ? 'Document served to selected cases in group. '
      : 'Your entry has been added to the docket record.';

  await applicationContext.getNotificationGateway().sendNotificationToUser({
    applicationContext,
    clientConnectionId,
    message: {
      action: 'serve_document_complete',
      alertSuccess: {
        message: successMessage,
        overwritable: false,
      },
      pdfUrl: paperServicePdfUrl,
    },
    userId: user.userId,
  });
};

/**
 * Helper function to save any work items required when filing this docket entry
 *
 * @param {object} providers  The providers Object
 * @param {object} providers.applicationContext The application Context
 * @param {boolean} providers.isSavingForLater Whether or not we are saving these work items for later
 * @param {object} providers.workItem The work item we are saving
 */
const saveWorkItem = async ({
  applicationContext,
  isSavingForLater,
  workItem,
}) => {
  const workItemRaw = workItem.validate().toRawObject();
  const { isFileAttached } = workItem.docketEntry;

  if (isFileAttached && !isSavingForLater) {
    await applicationContext
      .getPersistenceGateway()
      .saveWorkItemForDocketClerkFilingExternalDocument({
        applicationContext,
        workItem: workItemRaw,
      });
  } else {
    await applicationContext.getPersistenceGateway().saveWorkItem({
      applicationContext,
      workItem: workItemRaw,
    });
  }
};
