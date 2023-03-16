import { Case } from '../../entities/cases/Case';
import {
  DOCKET_SECTION,
  DOCUMENT_RELATIONSHIPS,
} from '../../entities/EntityConstants';
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
 * @param {array} providers.docketNumbersForFiling an array of docket numbers representing consolidated cases
 * @param {object} providers.documentMetadata the metadata for all the documents
 * @param {string} providers.leadDocketNumber the lead docket number in the consolidated cases
 * @returns {Promise<*>} an array of the updated consolidated cases
 */
export const fileExternalDocumentForConsolidatedInteractor = async (
  applicationContext: IApplicationContext,
  {
    docketNumbersForFiling,
    documentMetadata,
    leadDocketNumber,
  }: {
    docketNumbersForFiling: string[];
    documentMetadata: any;
    leadDocketNumber: string;
  },
) => {
  const authorizedUser = applicationContext.getCurrentUser();

  if (!isAuthorized(authorizedUser, ROLE_PERMISSIONS.FILE_IN_CONSOLIDATED)) {
    throw new UnauthorizedError('Unauthorized');
  }

  const user = await applicationContext
    .getPersistenceGateway()
    .getUserById({ applicationContext, userId: authorizedUser.userId });

  const consolidatedCases = await applicationContext
    .getPersistenceGateway()
    .getCasesByLeadDocketNumber({
      applicationContext,
      leadDocketNumber,
    });

  // TODO: Return error if lead case not found?

  const casesForDocumentFiling = [];
  const docketNumbersForDocumentFiling = [];

  const consolidatedCaseEntities = consolidatedCases.map(consolidatedCase => {
    const { docketNumber } = consolidatedCase;
    const caseEntity = new Case(consolidatedCase, { applicationContext });
    const oldCaseCopy = applicationContext
      .getUtilities()
      .cloneAndFreeze(consolidatedCase);

    if (docketNumbersForFiling.includes(consolidatedCase.docketNumber)) {
      // this serves the purpose of offering two different
      // look-ups to be used further down while minimizing
      // iterations over the case array
      docketNumbersForDocumentFiling.push(docketNumber);
      casesForDocumentFiling.push(caseEntity);
    }

    return { caseEntity, oldCaseCopy };
  });

  const caseWithLowestDocketNumber = Case.sortByDocketNumber(
    casesForDocumentFiling,
  ).shift();

  const {
    secondaryDocument,
    secondarySupportingDocuments,
    supportingDocuments,
    ...primaryDocumentMetadata
  } = documentMetadata;

  const baseMetadata = pick(primaryDocumentMetadata, [
    'partyPrimary',
    'partySecondary',
    'partyIrsPractitioner',
    'practitioner',
    'docketNumber',
  ]);

  if (secondarySupportingDocuments) {
    secondarySupportingDocuments.forEach(item => {
      item.lodged = true;
    });
  }

  const documentsToAdd = [
    [
      documentMetadata.primaryDocumentId,
      primaryDocumentMetadata,
      DOCUMENT_RELATIONSHIPS.PRIMARY,
    ],
  ];

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

  const saveCasesMap = {};
  const saveWorkItems = [];
  const sendEmails = [];

  for (let [docketEntryId, metadata, relationship] of documentsToAdd) {
    if (docketEntryId && metadata) {
      // TODO: Double check what is auto-generated here,
      // as this may not be entirely necessary
      const rawDocument = new DocketEntry(
        {
          ...baseMetadata,
          ...metadata,
          docketEntryId,
          documentTitle: metadata.documentTitle,
          documentType: metadata.documentType,
          isOnDocketRecord: true,
          relationship,
          userId: user.userId,
        },
        { applicationContext },
      ).toRawObject();

      for (let { caseEntity, oldCaseCopy } of consolidatedCaseEntities) {
        const isFilingDocumentForCase = docketNumbersForDocumentFiling.includes(
          caseEntity.docketNumber,
        );

        const docketEntryEntity = new DocketEntry(
          {
            ...rawDocument,
          },
          {
            applicationContext,
            petitioners: caseEntity.petitioners,
          },
        );

        const isAutoServed = docketEntryEntity.isAutoServed();

        if (isFilingDocumentForCase) {
          const isCaseForWorkItem =
            caseEntity.docketNumber === caseWithLowestDocketNumber.docketNumber;

          const servedParties = aggregatePartiesForService(caseEntity);

          if (isCaseForWorkItem) {
            // The case with the lowest docket number
            // in the filing gets the work item
            const workItem = new WorkItem(
              {
                assigneeId: null,
                assigneeName: null,
                associatedJudge: caseEntity.associatedJudge,
                caseStatus: caseEntity.status,
                caseTitle: Case.getCaseTitle(caseEntity.caseCaption),
                docketEntry: {
                  ...docketEntryEntity.toRawObject(),
                  createdAt: docketEntryEntity.createdAt,
                },
                docketNumber: caseEntity.docketNumber,
                docketNumberWithSuffix: caseEntity.docketNumberWithSuffix,
                section: DOCKET_SECTION,
                sentBy: user.name,
                sentByUserId: user.userId,
              },
              { applicationContext },
            );

            docketEntryEntity.setWorkItem(workItem);

            if (metadata.isPaper) {
              workItem.setAsCompleted({
                message: 'completed',
                user,
              });

              workItem.assignToUser({
                assigneeId: user.userId,
                assigneeName: user.name,
                section: user.section,
                sentBy: user.name,
                sentBySection: user.section,
                sentByUserId: user.userId,
              });
            }

            saveWorkItems.push(
              applicationContext.getPersistenceGateway().saveWorkItem({
                applicationContext,
                workItem: workItem.validate().toRawObject(),
              }),
            );
          }

          caseEntity.addDocketEntry(docketEntryEntity);

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

        saveCasesMap[caseEntity.docketNumber] = await applicationContext
          .getUseCaseHelpers()
          .updateCaseAndAssociations({
            applicationContext,
            newCase: caseEntity,
            oldCaseCopy,
          });
      } // consolidatedCases
    }
  } // documentsToAdd
  const saveCases = Object.keys(saveCasesMap).map(
    docketNumber => saveCasesMap[docketNumber],
  );

  const savedCases = await Promise.all(saveCases);
  await Promise.all(saveWorkItems);
  await Promise.all(sendEmails);

  return savedCases;
};
