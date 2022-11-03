import { Case } from '../../entities/cases/Case';
import {
  ROLE_PERMISSIONS,
  isAuthorized,
} from '../../../authorization/authorizationClientService';
import { UnauthorizedError } from '../../../errors/errors';
import { addCoverToPdf } from '../addCoverToPdf';
import { aggregatePartiesForService } from '../../utilities/aggregatePartiesForService';

/**
 * serveExternallyFiledDocumentInteractor
 *
 * @param {object} applicationContext the application context
 * @param {object} providers the providers object
 * @param {string} providers.docketNumber the docket number of the case containing the document to serve
 * @param {string} providers.docketEntryId the id of the docket entry to serve
 * @returns {object} the paper service pdf url
 */
export const serveExternallyFiledDocumentInteractor = async (
  applicationContext: IApplicationContext,
  {
    docketEntryId,
    docketNumber,
  }: { docketEntryId: string; docketNumber: string },
) => {
  const authorizedUser = applicationContext.getCurrentUser();

  if (!isAuthorized(authorizedUser, ROLE_PERMISSIONS.SERVE_DOCUMENT)) {
    throw new UnauthorizedError('Unauthorized');
  }

  const user = await applicationContext
    .getPersistenceGateway()
    .getUserById({ applicationContext, userId: authorizedUser.userId });

  const caseToUpdate = await applicationContext
    .getPersistenceGateway()
    .getCaseByDocketNumber({
      applicationContext,
      docketNumber,
    });
  const caseEntity = new Case(caseToUpdate, { applicationContext });

  const currentDocketEntry = caseEntity.getDocketEntryById({
    docketEntryId,
  });

  if (currentDocketEntry.isPendingService) {
    throw new Error('Docket entry is already being served');
  } else {
    await applicationContext
      .getPersistenceGateway()
      .updateDocketEntryPendingServiceStatus({
        applicationContext,
        docketEntryId: currentDocketEntry.docketEntryId,
        docketNumber: caseToUpdate.docketNumber,
        status: true,
      });
  }

  try {
    const servedParties = aggregatePartiesForService(caseEntity);
    currentDocketEntry.setAsServed(servedParties.all);
    currentDocketEntry.setAsProcessingStatusAsCompleted();

    const { Body: pdfData } = await applicationContext
      .getStorageClient()
      .getObject({
        Bucket: applicationContext.environment.documentsBucketName,
        Key: docketEntryId,
      })
      .promise();

    caseEntity.updateDocketEntry(currentDocketEntry);

    const { pdfData: servedDocWithCover } = await addCoverToPdf({
      applicationContext,
      caseEntity,
      docketEntryEntity: currentDocketEntry,
      pdfData,
    });

    await applicationContext.getPersistenceGateway().saveDocumentFromLambda({
      applicationContext,
      document: servedDocWithCover,
      key: docketEntryId,
    });

    const workItemToUpdate = currentDocketEntry.workItem;

    if (workItemToUpdate) {
      workItemToUpdate.setAsCompleted({
        message: 'completed',
        user,
      });

      workItemToUpdate.assignToUser({
        assigneeId: user.userId,
        assigneeName: user.name,
        section: user.section,
        sentBy: user.name,
        sentBySection: user.section,
        sentByUserId: user.userId,
      });

      await applicationContext
        .getPersistenceGateway()
        .saveWorkItemForDocketClerkFilingExternalDocument({
          applicationContext,
          workItem: workItemToUpdate.validate().toRawObject(),
        });
    }

    await applicationContext.getUseCaseHelpers().updateCaseAndAssociations({
      applicationContext,
      caseToUpdate: caseEntity,
    });

    const serviceResults = await applicationContext
      .getUseCaseHelpers()
      .serveDocumentAndGetPaperServicePdf({
        applicationContext,
        caseEntities: [caseEntity],
        docketEntryId: currentDocketEntry.docketEntryId,
      });

    await applicationContext
      .getPersistenceGateway()
      .updateDocketEntryPendingServiceStatus({
        applicationContext,
        docketEntryId: currentDocketEntry.docketEntryId,
        docketNumber: caseToUpdate.docketNumber,
        status: false,
      });

    return serviceResults;
  } catch (e) {
    await applicationContext
      .getPersistenceGateway()
      .updateDocketEntryPendingServiceStatus({
        applicationContext,
        docketEntryId: currentDocketEntry.docketEntryId,
        docketNumber: caseToUpdate.docketNumber,
        status: false,
      });

    throw e;
  }
};
