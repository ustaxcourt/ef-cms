import { Case } from '../../entities/cases/Case';
import { DocketEntry } from '../../entities/DocketEntry';
import { NotFoundError, UnauthorizedError } from '../../../errors/errors';
import {
  ROLE_PERMISSIONS,
  isAuthorized,
} from '../../../authorization/authorizationClientService';
import { createISODateString } from '../../utilities/DateHandler';

/**
 * serveCourtIssuedDocumentInteractor
 *
 * @param {object} applicationContext the application context
 * @param {object} providers the providers object
 * @param {string} providers.clientConnectionId the UUID of the websocket connection for the current tab
 * @param {String} providers.docketEntryId the ID of the docket entry being served
 * @param {String[]} providers.docketNumbers the docket numbers that this docket entry needs to be served on
 * @param {string} providers.subjectCaseDocketNumber the docket number of the case containing the document to serve
 */
export const serveCourtIssuedDocumentInteractor = async (
  applicationContext,
  { clientConnectionId, docketEntryId, docketNumbers, subjectCaseDocketNumber },
) => {
  const authorizedUser = applicationContext.getCurrentUser();

  const hasPermission =
    (isAuthorized(authorizedUser, ROLE_PERMISSIONS.DOCKET_ENTRY) ||
      isAuthorized(
        authorizedUser,
        ROLE_PERMISSIONS.CREATE_ORDER_DOCKET_ENTRY,
      )) &&
    isAuthorized(authorizedUser, ROLE_PERMISSIONS.SERVE_DOCUMENT);

  if (!hasPermission) {
    throw new UnauthorizedError('Unauthorized');
  }

  const subjectCase = await applicationContext
    .getPersistenceGateway()
    .getCaseByDocketNumber({
      applicationContext,
      docketNumber: subjectCaseDocketNumber,
    });

  if (!subjectCase.docketNumber) {
    throw new NotFoundError(`Case ${subjectCaseDocketNumber} was not found.`);
  }

  const subjectCaseEntity = new Case(subjectCase, { applicationContext });

  const docketEntryToServe = subjectCaseEntity.getDocketEntryById({
    docketEntryId,
  });

  if (!docketEntryToServe) {
    throw new NotFoundError(`Docket entry ${docketEntryId} was not found.`);
  }
  if (docketEntryToServe.servedAt) {
    throw new Error('Docket entry has already been served');
  }

  if (docketEntryToServe.isPendingService) {
    throw new Error('Docket entry is already being served');
  }

  await applicationContext
    .getPersistenceGateway()
    .updateDocketEntryPendingServiceStatus({
      applicationContext,
      docketEntryId: docketEntryToServe.docketEntryId,
      docketNumber: subjectCaseEntity.docketNumber,
      status: true,
    });

  const { Body: pdfData } = await applicationContext
    .getStorageClient()
    .getObject({
      Bucket: applicationContext.environment.documentsBucketName,
      Key: docketEntryId,
    })
    .promise();

  const stampedPdf = await applicationContext
    .getUseCaseHelpers()
    .stampDocumentForService({
      applicationContext,
      documentToStamp: docketEntryToServe,
      pdfData,
    });

  docketEntryToServe.numberOfPages = await applicationContext
    .getUseCaseHelpers()
    .countPagesInDocument({
      applicationContext,
      docketEntryId,
    });

  const user = await applicationContext
    .getPersistenceGateway()
    .getUserById({ applicationContext, userId: authorizedUser.userId });

  let serviceResults;
  let caseEntities = [subjectCaseEntity];

  try {
    for (const docketNumber of docketNumbers) {
      if (docketNumber !== subjectCaseDocketNumber) {
        const caseToUpdate = await applicationContext
          .getPersistenceGateway()
          .getCaseByDocketNumber({
            applicationContext,
            docketNumber,
          });

        caseEntities.push(new Case(caseToUpdate, { applicationContext }));
      }
    }

    caseEntities = await Promise.all(
      caseEntities.map(caseEntity => {
        const docketEntryEntity = new DocketEntry(
          {
            ...docketEntryToServe,
            filingDate: createISODateString(),
            isOnDocketRecord: true,
          },
          {
            applicationContext,
          },
        );

        return applicationContext.getUseCaseHelpers().fileDocumentOnOneCase({
          applicationContext,
          caseEntity,
          docketEntryEntity,
          subjectCaseDocketNumber,
          user,
        });
      }),
    );

    serviceResults = await applicationContext
      .getUseCaseHelpers()
      .serveDocumentAndGetPaperServicePdf({
        applicationContext,
        caseEntities,
        docketEntryId,
        stampedPdf,
      });
  } finally {
    for (const caseEntity of caseEntities) {
      try {
        await applicationContext
          .getPersistenceGateway()
          .updateDocketEntryPendingServiceStatus({
            applicationContext,
            docketEntryId,
            docketNumber: caseEntity.docketNumber,
            status: false,
          });
      } catch (e) {
        applicationContext.logger.error(
          `Encountered an exception trying to reset isPendingService on Docket Number ${caseEntity.docketNumber}.`,
          e,
        );
      }
    }
  }

  await applicationContext.getPersistenceGateway().saveDocumentFromLambda({
    applicationContext,
    document: stampedPdf,
    key: docketEntryId,
  });

  const successMessage =
    docketNumbers.length > 1
      ? 'Document served to selected cases in group. '
      : 'Document served. ';

  await applicationContext.getNotificationGateway().sendNotificationToUser({
    applicationContext,
    clientConnectionId,
    message: {
      action: 'serve_document_complete',
      alertSuccess: {
        message: successMessage,
        overwritable: false,
      },
      pdfUrl: serviceResults ? serviceResults.pdfUrl : undefined,
    },
    userId: user.userId,
  });
};
