import { Case, isLeadCase } from '../../entities/cases/Case';
import {
  DOCUMENT_RELATIONSHIPS,
  DOCUMENT_SERVED_MESSAGES,
} from '../../entities/EntityConstants';
import { DocketEntry } from '../../entities/DocketEntry';
import { NotFoundError, UnauthorizedError } from '@web-api/errors/errors';
import {
  ROLE_PERMISSIONS,
  isAuthorized,
} from '../../../authorization/authorizationClientService';
import { RawUser } from '@shared/business/entities/User';
import { cloneDeep, uniq } from 'lodash';
import { withLocking } from '@shared/business/useCaseHelper/acquireLock';

interface IEditPaperFilingRequest {
  documentMetadata: any;
  isSavingForLater: boolean;
  docketEntryId: string;
  consolidatedGroupDocketNumbers?: string[];
  clientConnectionId: string;
}

/**
 *
 * @param {object} applicationContext the application context
 * @param {IEditPaperFilingRequest} request the request data
 * @returns {object} The paper service PDF url
 */
export const editPaperFiling = async (
  applicationContext: IApplicationContext,
  request: IEditPaperFilingRequest,
) => {
  request.consolidatedGroupDocketNumbers =
    request.consolidatedGroupDocketNumbers || [];

  authorizeRequest(applicationContext);

  const { caseEntity, docketEntryEntity } = await getDocketEntryToEdit({
    applicationContext,
    docketEntryId: request.docketEntryId,
    docketNumber: request.documentMetadata.docketNumber,
  });

  validateDocketEntryCanBeEdited({
    docketEntry: docketEntryEntity,
    docketEntryId: request.docketEntryId,
  });

  const editPaperFilingStrategy = getEditPaperFilingStrategy({
    consolidatedGroupDocketNumbers: request.consolidatedGroupDocketNumbers,
    isSavingForLater: request.isSavingForLater,
  });

  return editPaperFilingStrategy({
    applicationContext,
    caseEntity,
    docketEntryEntity,
    request,
  });
};

const getEditPaperFilingStrategy = ({
  consolidatedGroupDocketNumbers,
  isSavingForLater,
}: {
  isSavingForLater: boolean;
  consolidatedGroupDocketNumbers?: string[];
}) => {
  if (isSavingForLater) {
    return saveForLaterStrategy;
  }

  if (consolidatedGroupDocketNumbers?.length) {
    return multiDocketServeStrategy;
  }

  if (consolidatedGroupDocketNumbers?.length === 0) {
    return singleDocketServeStrategy;
  }

  throw new Error('No strategy found to edit paper filing');
};

const saveForLaterStrategy = async ({
  applicationContext,
  caseEntity,
  docketEntryEntity,
  request,
}: {
  applicationContext: IApplicationContext;
  request: IEditPaperFilingRequest;
  caseEntity: Case;
  docketEntryEntity: DocketEntry;
}) => {
  const authorizedUser = applicationContext.getCurrentUser();

  const user = await applicationContext
    .getPersistenceGateway()
    .getUserById({ applicationContext, userId: authorizedUser.userId });

  const updatedDocketEntryEntity = await updateDocketEntry({
    applicationContext,
    caseEntity,
    docketEntry: docketEntryEntity,
    documentMetadata: request.documentMetadata,
    userId: user.userId,
  });

  await updateAndSaveWorkItem({
    applicationContext,
    docketEntry: updatedDocketEntryEntity,
    user,
  });

  await applicationContext.getUseCaseHelpers().updateCaseAndAssociations({
    applicationContext,
    caseToUpdate: caseEntity,
  });

  const { clientConnectionId, docketEntryId } = request;

  await applicationContext.getNotificationGateway().sendNotificationToUser({
    applicationContext,
    clientConnectionId,
    message: {
      action: 'save_docket_entry_for_later_complete',
      alertSuccess: {
        message: 'Entry updated.',
        overwritable: false,
      },
      docketEntryId,
    },
    userId: user.userId,
  });
};

const multiDocketServeStrategy = async ({
  applicationContext,
  caseEntity,
  docketEntryEntity,
  request,
}: {
  applicationContext: IApplicationContext;
  caseEntity: Case;
  docketEntryEntity: DocketEntry;
  request: IEditPaperFilingRequest;
}) => {
  validateDocketEntryCanBeServed({
    documentMetadata: request.documentMetadata,
  });

  const consolidatedCaseRecords = await Promise.all(
    request.consolidatedGroupDocketNumbers!.map(consolidatedGroupDocketNumber =>
      applicationContext.getPersistenceGateway().getCaseByDocketNumber({
        applicationContext,
        docketNumber: consolidatedGroupDocketNumber,
      }),
    ),
  );

  const consolidatedCaseEntities = consolidatedCaseRecords.map(
    consolidatedCase => new Case(consolidatedCase, { applicationContext }),
  );

  validateMultiDocketPaperFilingRequest({
    caseEntity,
    consolidatedCases: consolidatedCaseEntities,
  });

  const caseEntitiesToFileOn = [caseEntity, ...consolidatedCaseEntities];

  const authorizedUser = applicationContext.getCurrentUser();

  await serveDocketEntry({
    applicationContext,
    caseEntitiesToFileOn,
    clientConnectionId: request.clientConnectionId,
    docketEntryEntity,
    documentMetadata: request.documentMetadata,
    message: DOCUMENT_SERVED_MESSAGES.SELECTED_CASES,
    subjectCaseEntity: caseEntity,
    userId: authorizedUser.userId,
  });
};

const singleDocketServeStrategy = async ({
  applicationContext,
  caseEntity,
  docketEntryEntity,
  request,
}: {
  applicationContext: IApplicationContext;
  caseEntity: Case;
  docketEntryEntity: DocketEntry;
  request: IEditPaperFilingRequest;
}) => {
  validateDocketEntryCanBeServed({
    documentMetadata: request.documentMetadata,
  });

  const caseEntitiesToFileOn = [caseEntity];

  const authorizedUser = applicationContext.getCurrentUser();

  await serveDocketEntry({
    applicationContext,
    caseEntitiesToFileOn,
    clientConnectionId: request.clientConnectionId,
    docketEntryEntity,
    documentMetadata: request.documentMetadata,
    message: DOCUMENT_SERVED_MESSAGES.GENERIC,
    subjectCaseEntity: caseEntity,
    userId: authorizedUser.userId,
  });
};

// *********************************** Small Helper Functions ***********************************
const serveDocketEntry = async ({
  applicationContext,
  caseEntitiesToFileOn,
  clientConnectionId,
  docketEntryEntity,
  documentMetadata,
  message,
  subjectCaseEntity,
  userId,
}: {
  applicationContext: IApplicationContext;
  caseEntitiesToFileOn: Case[];
  clientConnectionId: string;
  docketEntryEntity: DocketEntry;
  documentMetadata: any;
  userId: string;
  subjectCaseEntity: Case;
  message: string;
}) => {
  await applicationContext
    .getPersistenceGateway()
    .updateDocketEntryPendingServiceStatus({
      applicationContext,
      docketEntryId: docketEntryEntity.docketEntryId,
      docketNumber: subjectCaseEntity.docketNumber,
      status: true,
    });

  try {
    const user = await applicationContext
      .getPersistenceGateway()
      .getUserById({ applicationContext, userId });

    const updatedDocketEntry = await updateDocketEntry({
      applicationContext,
      caseEntity: subjectCaseEntity,
      docketEntry: docketEntryEntity,
      documentMetadata,
      userId: user.userId,
    });

    caseEntitiesToFileOn = await Promise.all(
      caseEntitiesToFileOn.map(aCase =>
        applicationContext.getUseCaseHelpers().fileAndServeDocumentOnOneCase({
          applicationContext,
          caseEntity: aCase,
          docketEntryEntity: new DocketEntry(cloneDeep(updatedDocketEntry), {
            applicationContext,
          }),
          subjectCaseDocketNumber: subjectCaseEntity.docketNumber,
          user,
        }),
      ),
    );

    const paperServiceResult = await applicationContext
      .getUseCaseHelpers()
      .serveDocumentAndGetPaperServicePdf({
        applicationContext,
        caseEntities: caseEntitiesToFileOn,
        docketEntryId: updatedDocketEntry.docketEntryId,
      });

    const paperServicePdfUrl = paperServiceResult?.pdfUrl;

    await applicationContext.getNotificationGateway().sendNotificationToUser({
      applicationContext,
      clientConnectionId,
      message: {
        action: 'serve_document_complete',
        alertSuccess: {
          message,
          overwritable: false,
        },
        docketEntryId: docketEntryEntity.docketEntryId,
        generateCoversheet: true,
        pdfUrl: paperServicePdfUrl,
      },
      userId: user.userId,
    });

    await applicationContext
      .getPersistenceGateway()
      .updateDocketEntryPendingServiceStatus({
        applicationContext,
        docketEntryId: docketEntryEntity.docketEntryId,
        docketNumber: subjectCaseEntity.docketNumber,
        status: false,
      });
  } catch (e) {
    await applicationContext
      .getPersistenceGateway()
      .updateDocketEntryPendingServiceStatus({
        applicationContext,
        docketEntryId: docketEntryEntity.docketEntryId,
        docketNumber: subjectCaseEntity.docketNumber,
        status: false,
      });

    throw e;
  }
};

const validateDocketEntryCanBeEdited = ({
  docketEntry,
  docketEntryId,
}: {
  docketEntry: DocketEntry;
  docketEntryId: string;
}): void => {
  if (!docketEntry) {
    throw new NotFoundError(`Docket entry ${docketEntryId} was not found.`);
  } else if (docketEntry.servedAt) {
    throw new Error('Docket entry has already been served');
  } else if (docketEntry.isPendingService) {
    throw new Error('Docket entry is already being served');
  }
};

const validateDocketEntryCanBeServed = ({
  documentMetadata,
}: {
  documentMetadata: any;
}): void => {
  if (!documentMetadata.isFileAttached) {
    throw new Error('Docket entry cannot be served without a file attached');
  }
};

const validateMultiDocketPaperFilingRequest = ({
  caseEntity,
  consolidatedCases,
}: {
  caseEntity: Case;
  consolidatedCases: Case[];
}): void => {
  if (!isLeadCase(caseEntity)) {
    throw new Error('Cannot multi-docket on a case that is not consolidated');
  }

  consolidatedCases.forEach(consolidatedCase => {
    if (consolidatedCase.leadDocketNumber !== caseEntity.docketNumber) {
      throw new Error('Cannot multi-docket on a case that is not consolidated');
    }
  });
};

const authorizeRequest = (applicationContext: IApplicationContext): void => {
  const authorizedUser = applicationContext.getCurrentUser();

  if (!isAuthorized(authorizedUser, ROLE_PERMISSIONS.DOCKET_ENTRY)) {
    throw new UnauthorizedError('Unauthorized');
  }
};

const updateDocketEntry = async ({
  applicationContext,
  caseEntity,
  docketEntry,
  documentMetadata,
  userId,
}: {
  applicationContext: IApplicationContext;
  caseEntity: Case;
  docketEntry: DocketEntry;
  documentMetadata: any;
  userId: string;
}): Promise<DocketEntry> => {
  const editableFields = {
    addToCoversheet: documentMetadata.addToCoversheet,
    additionalInfo: documentMetadata.additionalInfo,
    additionalInfo2: documentMetadata.additionalInfo2,
    attachments: documentMetadata.attachments,
    certificateOfService: documentMetadata.certificateOfService,
    certificateOfServiceDate: documentMetadata.certificateOfServiceDate,
    documentTitle: documentMetadata.documentTitle,
    documentType: documentMetadata.documentType,
    eventCode: documentMetadata.eventCode,
    filers: documentMetadata.filers,
    freeText: documentMetadata.freeText,
    freeText2: documentMetadata.freeText2,
    hasOtherFilingParty: documentMetadata.hasOtherFilingParty,
    isFileAttached: documentMetadata.isFileAttached,
    lodged: documentMetadata.lodged,
    mailingDate: documentMetadata.mailingDate,
    objections: documentMetadata.objections,
    ordinalValue: documentMetadata.ordinalValue,
    otherFilingParty: documentMetadata.otherFilingParty,
    otherIteration: documentMetadata.otherIteration,
    partyIrsPractitioner: documentMetadata.partyIrsPractitioner,
    pending: documentMetadata.pending,
    receivedAt: documentMetadata.receivedAt,
    scenario: documentMetadata.scenario,
    serviceDate: documentMetadata.serviceDate,
  };

  const updatedDocketEntryEntity: DocketEntry = new DocketEntry(
    {
      ...docketEntry,
      ...editableFields,
      editState: JSON.stringify(editableFields),
      isOnDocketRecord: true,
      relationship: DOCUMENT_RELATIONSHIPS.PRIMARY,
      userId,
    },
    { applicationContext, petitioners: caseEntity.petitioners },
  );

  if (editableFields.isFileAttached) {
    updatedDocketEntryEntity.numberOfPages = await applicationContext
      .getUseCaseHelpers()
      .countPagesInDocument({
        applicationContext,
        docketEntryId: docketEntry.docketEntryId,
      });
  }

  caseEntity.updateDocketEntry(updatedDocketEntryEntity);

  return updatedDocketEntryEntity;
};

const updateAndSaveWorkItem = async ({
  applicationContext,
  docketEntry,
  user,
}: {
  applicationContext: IApplicationContext;
  docketEntry: DocketEntry;
  user: RawUser;
}): Promise<void> => {
  const { workItem } = docketEntry;
  workItem.docketEntry = docketEntry.toRawObject();
  workItem.inProgress = true;

  workItem.assignToUser({
    assigneeId: user.userId,
    assigneeName: user.name,
    section: user.section,
    sentBy: user.name,
    sentBySection: user.section,
    sentByUserId: user.userId,
  });

  await applicationContext.getPersistenceGateway().saveWorkItem({
    applicationContext,
    workItem: workItem.validate().toRawObject(),
  });
};

const getDocketEntryToEdit = async ({
  applicationContext,
  docketEntryId,
  docketNumber,
}: {
  applicationContext: IApplicationContext;
  docketNumber: string;
  docketEntryId: string;
}): Promise<{
  caseEntity: Case;
  docketEntryEntity: DocketEntry;
}> => {
  const caseToUpdate = await applicationContext
    .getPersistenceGateway()
    .getCaseByDocketNumber({
      applicationContext,
      docketNumber,
    });

  const caseEntity = new Case(caseToUpdate, { applicationContext });

  const docketEntryEntity = caseEntity.getDocketEntryById({
    docketEntryId,
  });

  return { caseEntity, docketEntryEntity };
};

export const determineEntitiesToLock = (
  _applicationContext: IApplicationContext,
  {
    consolidatedGroupDocketNumbers = [],
    documentMetadata,
  }: {
    consolidatedGroupDocketNumbers?: string[];
    documentMetadata: {
      docketNumber: string;
    };
  },
) => ({
  identifiers: uniq([
    documentMetadata.docketNumber,
    ...consolidatedGroupDocketNumbers,
  ]).map(item => `case|${item}`),
  ttl: 900,
});

export const handleLockError = async (applicationContext, originalRequest) => {
  const user = applicationContext.getCurrentUser();

  await applicationContext.getNotificationGateway().sendNotificationToUser({
    applicationContext,
    clientConnectionId: originalRequest.clientConnectionId,
    message: {
      action: 'retry_async_request',
      originalRequest,
      requestToRetry: 'edit_paper_filing',
    },
    userId: user.userId,
  });
};

export const editPaperFilingInteractor = withLocking(
  editPaperFiling,
  determineEntitiesToLock,
  handleLockError,
);
