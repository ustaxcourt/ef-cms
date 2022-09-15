const {
  aggregatePartiesForService,
} = require('../../utilities/aggregatePartiesForService');
const {
  ALLOWLIST_FEATURE_FLAGS,
  DOCUMENT_RELATIONSHIPS,
  ROLES,
} = require('../../entities/EntityConstants');
import { Case } from '../../entities/cases/Case';
import { DOCKET_SECTION } from '../../entities/EntityConstants';
import { DocketEntry } from '../../entities/DocketEntry';
import {
  ROLE_PERMISSIONS,
  isAuthorized,
} from '../../../authorization/authorizationClientService';
import { UnauthorizedError } from '../../../errors/errors';
import { WorkItem } from '../../entities/WorkItem';
import { pick } from 'lodash';

/**
 *
 * @param {object} applicationContext the application context
 * @param {object} providers the providers object
 * @param {object} providers.documentMetadata the document metadata
 * @param {boolean} providers.isSavingForLater flag for saving docket entry for later instead of serving it
 * @param {string} providers.primaryDocumentFileId the id of the document file
 * @returns {object} the updated case after the documents are added
 */
export const addPaperFilingInteractor = async (
  applicationContext: IApplicationContext,
  {
    consolidatedGroupDocketNumbers,
    documentMetadata,
    isSavingForLater,
    primaryDocumentFileId,
  }: {
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

  // for later, consider refactoring to check if (case.leadDocketNumber === docketNumber), THEN AND ONLY THEN
  // you can file docket entries on consolidatedGroupDocketNumbers cases
  // otherwise, file a docket entry (like old behavior) on documentMetadata.docketNumber case ONLY

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

  let caseEntity = new Case(caseToUpdate, { applicationContext });

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

  const servedParties = aggregatePartiesForService(caseEntity);

  const docketRecordEditState =
    metadata.isFileAttached === false ? documentMetadata : {};

  let caseEntities = [];
  //TODO sorry for ugly
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
  //why raw case? who knows. couldnt think of a name
  for (const rawCase of caseEntities) {
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
      { applicationContext, petitioners: rawCase.petitioners },
    );

    if (rawCase.docketNumber === rawCase.leadDocketNumber) {
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
        caseTitle: Case.getCaseTitle(rawCase.caseCaption),
        docketEntry: {
          ...docketEntryEntity.toRawObject(),
          createdAt: docketEntryEntity.createdAt,
        },
        docketNumber: caseToUpdate.docketNumber,
        docketNumberWithSuffix: caseToUpdate.docketNumberWithSuffix,
        inProgress: isSavingForLater,
        isRead: user.role !== ROLES.privatePractitioner,
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

    rawCase.addDocketEntry(docketEntryEntity);
    const aCaseEntity = await applicationContext
      .getUseCaseHelpers()
      .updateCaseAutomaticBlock({
        applicationContext,
        caseEntity: rawCase,
      });

    // todo: why save case twice? this call also does NOT validate before saving, bad????
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

  if (readyForService) {
    const paperServiceResult = await applicationContext
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

  // todo: return lead case OR subject case NOT caseEntity (could just be the last in the list)
  return { caseDetail: caseEntity.toRawObject(), paperServicePdfUrl };
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
