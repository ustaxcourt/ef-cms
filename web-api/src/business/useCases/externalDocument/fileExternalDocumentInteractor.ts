import {
  CASE_STATUS_TYPES,
  DOCKET_SECTION,
  DOCUMENT_RELATIONSHIPS,
} from '@shared/business/entities/EntityConstants';
import { Case } from '@shared/business/entities/cases/Case';
import { DocketEntry } from '@shared/business/entities/DocketEntry';
import {
  ROLE_PERMISSIONS,
  isAuthorized,
} from '@shared/authorization/authorizationClientService';
import { ServerApplicationContext } from '@web-api/applicationContext';
import { UnauthorizedError } from '@web-api/errors/errors';
import { UnknownAuthUser } from '@shared/business/entities/authUser/AuthUser';
import { WorkItem } from '@shared/business/entities/WorkItem';
import { aggregatePartiesForService } from '@shared/business/utilities/aggregatePartiesForService';
import { pick } from 'lodash';
import { withLocking } from '@web-api/business/useCaseHelper/acquireLock';
import { saveWorkItem } from '@web-api/persistence/postgres/workitems/saveWorkItem';

/**
 * fileExternalDocumentInteractor
 * @param {object} applicationContext the application context
 * @param {object} providers the providers object
 * @param {object} providers.documentMetadata the metadata for all the documents
 * @returns {object} the updated case after the documents have been added
 */
export const fileExternalDocument = async (
  applicationContext: ServerApplicationContext,
  { documentMetadata }: { documentMetadata: any },
  authorizedUser: UnknownAuthUser,
) => {
  if (!isAuthorized(authorizedUser, ROLE_PERMISSIONS.FILE_EXTERNAL_DOCUMENT)) {
    throw new UnauthorizedError('Unauthorized');
  }

  const user = await applicationContext
    .getPersistenceGateway()
    .getUserById({ applicationContext, userId: authorizedUser.userId });

  const { docketNumber } = documentMetadata;
  const workItems: WorkItem[] = [];

  const currentCase = await applicationContext
    .getPersistenceGateway()
    .getCaseByDocketNumber({
      applicationContext,
      docketNumber,
    });

  let currentCaseEntity = new Case(currentCase, { authorizedUser });

  const {
    consolidatedCasesToFileAcross,
    secondaryDocument,
    secondarySupportingDocuments,
    supportingDocuments,
    ...primaryDocumentMetadata
  } = documentMetadata;

  const baseMetadata = pick(primaryDocumentMetadata, [
    'filers',
    'partyIrsPractitioner',
    'practitioner',
    'docketNumber',
  ]);
  const documentsToAdd = [
    [
      documentMetadata.primaryDocumentId,
      { ...primaryDocumentMetadata, secondaryDocument },
      DOCUMENT_RELATIONSHIPS.PRIMARY,
    ],
  ];

  if (secondarySupportingDocuments) {
    secondarySupportingDocuments.forEach(item => {
      item.lodged = true;
    });
  }

  if (supportingDocuments) {
    for (let i = 0; i < supportingDocuments.length; i++) {
      documentsToAdd.push([
        supportingDocuments[i].docketEntryId,
        supportingDocuments[i],
        DOCUMENT_RELATIONSHIPS.PRIMARY_SUPPORTING,
      ]);
    }
  }

  if (secondaryDocument) {
    secondaryDocument.lodged = true;

    documentsToAdd.push([
      secondaryDocument.docketEntryId,
      secondaryDocument,
      DOCUMENT_RELATIONSHIPS.SECONDARY,
    ]);
  }

  if (secondarySupportingDocuments) {
    for (let i = 0; i < secondarySupportingDocuments.length; i++) {
      documentsToAdd.push([
        secondarySupportingDocuments[i].docketEntryId,
        secondarySupportingDocuments[i],
        DOCUMENT_RELATIONSHIPS.SUPPORTING,
      ]);
    }
  }

  let documentMetadataForConsolidatedCases: TDocumentMetaData[] = [];
  if (
    consolidatedCasesToFileAcross &&
    consolidatedCasesToFileAcross.length > 0
  ) {
    for (let index = 0; index < consolidatedCasesToFileAcross.length; index++) {
      documentMetadataForConsolidatedCases.push({
        ...documentMetadata,
        docketNumber: consolidatedCasesToFileAcross[index].docketNumber,
      });
    }
  } else {
    documentMetadataForConsolidatedCases.push(documentMetadata);
  }

  const consolidatedCaseEntities: Promise<RawCase>[] =
    documentMetadataForConsolidatedCases.map(
      async individualDocumentMetadata => {
        const caseToUpdate = await applicationContext
          .getPersistenceGateway()
          .getCaseByDocketNumber({
            applicationContext,
            docketNumber: individualDocumentMetadata.docketNumber,
          });

        let caseEntity = new Case(caseToUpdate, { authorizedUser });

        const servedParties = aggregatePartiesForService(caseEntity);

        for (let [docketEntryId, metadata, relationship] of documentsToAdd) {
          if (docketEntryId && metadata) {
            const docketEntryEntity = new DocketEntry(
              {
                ...baseMetadata,
                ...metadata,
                docketEntryId,
                documentType: metadata.documentType,
                isOnDocketRecord: true,
                relationship,
              },
              {
                authorizedUser,
                petitioners: currentCaseEntity.petitioners,
              },
            );

            docketEntryEntity.setFiledBy(user);

            docketEntryEntity.validate();

            const highPriorityWorkItem =
              caseEntity.status === CASE_STATUS_TYPES.calendared;

            const workItem = new WorkItem({
              assigneeId: null,
              assigneeName: null,
              associatedJudge: caseToUpdate.associatedJudge,
              associatedJudgeId: caseToUpdate.associatedJudgeId,
              caseStatus: caseToUpdate.status,
              caseTitle: Case.getCaseTitle(caseEntity.caseCaption),
              docketEntry: {
                ...docketEntryEntity.toRawObject(),
                createdAt: docketEntryEntity.createdAt,
              },
              docketNumber: caseToUpdate.docketNumber,
              docketNumberWithSuffix: caseToUpdate.docketNumberWithSuffix,
              highPriority: highPriorityWorkItem,
              leadDocketNumber: caseToUpdate.leadDocketNumber,
              section: DOCKET_SECTION,
              sentBy: user.name,
              sentByUserId: user.userId,
              trialDate: caseEntity.trialDate,
              trialLocation: caseEntity.trialLocation,
            }).validate();

            docketEntryEntity.setWorkItem(workItem);

            workItems.push(workItem);
            caseEntity.addDocketEntry(docketEntryEntity);

            const isAutoServed = docketEntryEntity.isAutoServed();

            if (isAutoServed) {
              docketEntryEntity.setAsServed(servedParties.all);

              await applicationContext
                .getUseCaseHelpers()
                .sendServedPartiesEmails({
                  applicationContext,
                  caseEntity,
                  docketEntryId: docketEntryEntity.docketEntryId,
                  servedParties,
                });
            }
          }
        }

        caseEntity = await applicationContext
          .getUseCaseHelpers()
          .updateCaseAutomaticBlock({
            applicationContext,
            caseEntity,
          });

        await applicationContext.getUseCaseHelpers().updateCaseAndAssociations({
          applicationContext,
          authorizedUser,
          caseToUpdate: caseEntity,
        });

        for (let workItem of workItems) {
          saveWorkItem({
            workItem: workItem.validate().toRawObject(),
          });
        }
        const rawCaseEntity = caseEntity.toRawObject();
        return rawCaseEntity;
      },
    );

  const resolvedCaseEntities: RawCase[] = await Promise.all(
    consolidatedCaseEntities,
  );
  return resolvedCaseEntities.find(
    caseEntity => caseEntity.docketNumber === docketNumber,
  );
};

export const fileExternalDocumentInteractor = withLocking(
  fileExternalDocument,
  (_applicationContext: ServerApplicationContext, { documentMetadata }) => ({
    identifiers: [`case|${documentMetadata.docketNumber}`],
  }),
);
