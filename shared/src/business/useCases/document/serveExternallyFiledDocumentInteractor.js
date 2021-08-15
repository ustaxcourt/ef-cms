const {
  aggregatePartiesForService,
} = require('../../utilities/aggregatePartiesForService');
const {
  isAuthorized,
  ROLE_PERMISSIONS,
} = require('../../../authorization/authorizationClientService');
const { addCoverToPdf } = require('../addCoversheetInteractor');
const { Case } = require('../../entities/cases/Case');
const { UnauthorizedError } = require('../../../errors/errors');

/**
 * serveExternallyFiledDocumentInteractor
 *
 * @param {object} applicationContext the application context
 * @param {object} providers the providers object
 * @param {string} providers.docketNumber the docket number of the case containing the document to serve
 * @param {string} providers.docketEntryId the id of the docket entry to serve
 * @returns {object} the paper service pdf url
 */
exports.serveExternallyFiledDocumentInteractor = async (
  applicationContext,
  { docketEntryId, docketNumber },
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

    caseEntity.updateDocketEntry(currentDocketEntry);

    await applicationContext.getUseCaseHelpers().updateCaseAndAssociations({
      applicationContext,
      caseToUpdate: caseEntity,
    });

    const serviceResults = await applicationContext
      .getUseCaseHelpers()
      .serveDocumentAndGetPaperServicePdf({
        applicationContext,
        caseEntity,
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
