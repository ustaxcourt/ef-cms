import { Case, isLeadCase } from '../../entities/cases/Case';
import { DOCUMENT_RELATIONSHIPS } from '../../entities/EntityConstants';
import { DocketEntry } from '../../entities/DocketEntry';
import { NotFoundError, UnauthorizedError } from '../../../errors/errors';
import {
  ROLE_PERMISSIONS,
  isAuthorized,
} from '../../../authorization/authorizationClientService';
import { aggregatePartiesForService } from '../../utilities/aggregatePartiesForService';

/**
 *
 * @param {object} applicationContext the application context
 * @param {object} providers the providers object
 * @param {string[]} providers.consolidatedGroupDocketNumbers list of consolidatedDocketNumbers to file docket entry on
 * @param {object} providers.documentMetadata the document metadata
 * @param {Boolean} providers.isSavingForLater true if saving for later, false otherwise
 * @param {string} providers.docketEntryId the id of the docket entry
 * @returns {object} The paper service PDF url
 */
export const editPaperFilingInteractor = async (
  applicationContext: IApplicationContext,
  {
    consolidatedGroupDocketNumbers = [],
    docketEntryId,
    documentMetadata,
    isSavingForLater,
  }: {
    documentMetadata: any;
    isSavingForLater: boolean;
    docketEntryId: string;
    consolidatedGroupDocketNumbers?: string[];
  },
) => {
  const authorizedUser = applicationContext.getCurrentUser();

  if (!isAuthorized(authorizedUser, ROLE_PERMISSIONS.DOCKET_ENTRY)) {
    throw new UnauthorizedError('Unauthorized');
  }

  const caseToUpdate = await applicationContext
    .getPersistenceGateway()
    .getCaseByDocketNumber({
      applicationContext,
      docketNumber: documentMetadata.docketNumber,
    });

  const caseEntity = new Case(caseToUpdate, { applicationContext });

  const currentDocketEntry = caseEntity.getDocketEntryById({
    docketEntryId,
  });

  let consolidatedCaseRecords = await Promise.all(
    consolidatedGroupDocketNumbers.map(consolidatedGroupDocketNumber =>
      applicationContext.getPersistenceGateway().getCaseByDocketNumber({
        applicationContext,
        docketNumber: consolidatedGroupDocketNumber,
      }),
    ),
  );

  let consolidatedCaseEntities = consolidatedCaseRecords.map(
    consolidatedCase => new Case(consolidatedCase, { applicationContext }),
  );

  validateDocketEntryCanBeEdited({
    docketEntry: currentDocketEntry,
    docketEntryId,
  });

  validateConsolidatedCasePaperFilingRequest({
    caseEntity,
    consolidatedCases: consolidatedCaseEntities,
    consolidatedGroupDocketNumbers,
  });

  const user = await applicationContext
    .getPersistenceGateway()
    .getUserById({ applicationContext, userId: authorizedUser.userId });

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
    partyIrsPractitioner: documentMetadata.partyIrsPractitioner,
    pending: documentMetadata.pending,
    receivedAt: documentMetadata.receivedAt,
    scenario: documentMetadata.scenario,
    serviceDate: documentMetadata.serviceDate,
  };

  const updatedDocketEntryEntity = new DocketEntry(
    {
      ...currentDocketEntry,
      ...editableFields,
      docketEntryId,
      editState: JSON.stringify(editableFields),
      isOnDocketRecord: true,
      relationship: DOCUMENT_RELATIONSHIPS.PRIMARY,
      userId: user.userId,
    },
    { applicationContext, petitioners: caseEntity.petitioners },
  );

  const { workItem } = updatedDocketEntryEntity;

  workItem.docketEntry = updatedDocketEntryEntity.toRawObject();
  workItem.inProgress = isSavingForLater;

  workItem.assignToUser({
    assigneeId: user.userId,
    assigneeName: user.name,
    section: user.section,
    sentBy: user.name,
    sentBySection: user.section,
    sentByUserId: user.userId,
  });

  let paperServicePdfUrl;

  try {
    if (isSavingForLater) {
      if (editableFields.isFileAttached) {
        updatedDocketEntryEntity.numberOfPages = await applicationContext
          .getUseCaseHelpers()
          .countPagesInDocument({
            applicationContext,
            docketEntryId,
          });
      }

      await saveWorkItem({
        applicationContext,
        isReadyForService: !isSavingForLater,
        workItem,
      });
    } else {
      await applicationContext
        .getPersistenceGateway()
        .updateDocketEntryPendingServiceStatus({
          applicationContext,
          docketEntryId: currentDocketEntry.docketEntryId,
          docketNumber: caseToUpdate.docketNumber,
          status: true,
        });

      if (editableFields.isFileAttached) {
        if (!isLeadCase(caseEntity)) {
          workItem.setAsCompleted({
            message: 'completed',
            user,
          });

          await saveWorkItem({
            applicationContext,
            isReadyForService: !isSavingForLater,
            workItem,
          });

          const servedParties = aggregatePartiesForService(caseEntity);
          updatedDocketEntryEntity.setAsServed(servedParties.all);
          updatedDocketEntryEntity.setAsProcessingStatusAsCompleted();

          caseEntity.updateDocketEntry(updatedDocketEntryEntity);
          const paperServiceResult = await applicationContext // TODO: Rename?
            .getUseCaseHelpers()
            .serveDocumentAndGetPaperServicePdf({
              applicationContext,
              caseEntities: [caseEntity],
              docketEntryId: updatedDocketEntryEntity.docketEntryId,
            });

          if (servedParties.paper.length > 0) {
            paperServicePdfUrl =
              paperServiceResult && paperServiceResult.pdfUrl;
          }
        } else {
          let caseEntitiesToFileOn = [caseEntity, ...consolidatedCaseEntities];

          caseEntitiesToFileOn = await Promise.all(
            caseEntitiesToFileOn.map(aCase =>
              applicationContext
                .getUseCaseHelpers()
                .fileAndServeDocumentOnOneCase({
                  applicationContext,
                  caseEntity: aCase,
                  docketEntryEntity: updatedDocketEntryEntity,
                  subjectCaseDocketNumber: documentMetadata.docketNumber,
                  user,
                }),
            ),
          );

          const paperServiceResult = await applicationContext // TODO: Rename?
            .getUseCaseHelpers()
            .serveDocumentAndGetPaperServicePdf({
              applicationContext,
              caseEntities: caseEntitiesToFileOn,
              docketEntryId: updatedDocketEntryEntity.docketEntryId,
            });

          paperServicePdfUrl = paperServiceResult?.pdfUrl;
        }
      }
    }

    caseEntity.updateDocketEntry(updatedDocketEntryEntity);

    await applicationContext.getUseCaseHelpers().updateCaseAndAssociations({
      applicationContext,
      caseToUpdate: caseEntity,
    });

    if (!isSavingForLater) {
      await applicationContext
        .getPersistenceGateway()
        .updateDocketEntryPendingServiceStatus({
          applicationContext,
          docketEntryId: currentDocketEntry.docketEntryId,
          docketNumber: caseToUpdate.docketNumber,
          status: false,
        });
    }

    return {
      paperServicePdfUrl,
    };
  } catch (e) {
    if (!isSavingForLater) {
      await applicationContext
        .getPersistenceGateway()
        .updateDocketEntryPendingServiceStatus({
          applicationContext,
          docketEntryId: currentDocketEntry.docketEntryId,
          docketNumber: caseToUpdate.docketNumber,
          status: false,
        });
    }

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

const validateConsolidatedCasePaperFilingRequest = ({
  caseEntity,
  consolidatedCases,
  consolidatedGroupDocketNumbers,
}: {
  caseEntity: Case;
  consolidatedCases: Case[];
  consolidatedGroupDocketNumbers: string[];
}): void => {
  if (isLeadCase(caseEntity)) {
    consolidatedCases.forEach(consolidatedCase => {
      if (consolidatedCase.leadDocketNumber !== caseEntity.docketNumber) {
        throw new Error(
          'Cannot multi-docket on a case that is not consolidated',
        );
      }
    });
  }

  if (!isLeadCase(caseEntity) && consolidatedGroupDocketNumbers?.length) {
    throw new Error('Cannot multi-docket on a case that is not consolidated');
  }
};

const saveWorkItem = async ({
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

  await applicationContext.getPersistenceGateway().saveWorkItem({
    applicationContext,
    workItem: workItemRaw,
  });
};
