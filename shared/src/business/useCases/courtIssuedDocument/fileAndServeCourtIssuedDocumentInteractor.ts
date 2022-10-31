import { Case } from '../../entities/cases/Case';
import {
  ENTERED_AND_SERVED_EVENT_CODES,
  GENERIC_ORDER_DOCUMENT_TYPE,
} from '../../entities/courtIssuedDocument/CourtIssuedDocumentConstants';
import { NotFoundError, UnauthorizedError } from '../../../errors/errors';
import {
  ROLE_PERMISSIONS,
  isAuthorized,
} from '../../../authorization/authorizationClientService';
import {
  createISODateString,
  formatDateString,
} from '../../utilities/DateHandler';

/**
 * fileAndServeCourtIssuedDocumentInteractor
 *
 * @param {Object} applicationContext the application context
 * @param {Object} providers the providers object
 * @param {string} providers.clientConnectionId the UUID of the websocket connection for the current tab
 * @param {String} providers.docketEntryId the ID of the docket entry being filed and served
 * @param {String[]} providers.docketNumbers the docket numbers that this docket entry needs to be filed and served on, will be one or more docket numbers
 * @param {Object} providers.form the form from the front end that has last minute modifications to the docket entry
 * @param {String} providers.subjectCaseDocketNumber the docket number that initiated the filing and service
 * @returns {Object} the URL of the document that was served
 */
export const fileAndServeCourtIssuedDocumentInteractor = async (
  applicationContext: IApplicationContext,
  {
    clientConnectionId,
    docketEntryId,
    docketNumbers,
    form,
    subjectCaseDocketNumber,
  }: {
    clientConnectionId: string;
    docketEntryId: string;
    docketNumbers: string[];
    form: any;
    subjectCaseDocketNumber: string;
  },
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

  const user = await applicationContext
    .getPersistenceGateway()
    .getUserById({ applicationContext, userId: authorizedUser.userId });

  const subjectCase = await applicationContext
    .getPersistenceGateway()
    .getCaseByDocketNumber({
      applicationContext,
      docketNumber: subjectCaseDocketNumber,
    });

  const subjectCaseEntity = new Case(subjectCase, { applicationContext });

  const originalSubjectDocketEntry = subjectCaseEntity.getDocketEntryById({
    docketEntryId,
  });

  if (!originalSubjectDocketEntry) {
    throw new NotFoundError('Docket entry not found');
  }
  if (originalSubjectDocketEntry.servedAt) {
    throw new Error('Docket entry has already been served');
  }
  if (originalSubjectDocketEntry.isPendingService) {
    throw new Error('Docket entry is already being served');
  }

  const { Body: pdfData } = await applicationContext
    .getStorageClient()
    .getObject({
      Bucket: applicationContext.environment.documentsBucketName,
      Key: originalSubjectDocketEntry.docketEntryId,
    })
    .promise();

  const stampedPdf = await stampDocument({
    applicationContext,
    form,
    pdfData,
  });

  const numberOfPages = await applicationContext
    .getUseCaseHelpers()
    .countPagesInDocument({
      applicationContext,
      docketEntryId,
      documentBytes: pdfData,
    });

  await applicationContext
    .getPersistenceGateway()
    .updateDocketEntryPendingServiceStatus({
      applicationContext,
      docketEntryId: originalSubjectDocketEntry.docketEntryId,
      docketNumber: subjectCaseDocketNumber,
      status: true,
    });

  let caseEntities = [];
  let serviceResults;

  try {
    for (const docketNumber of docketNumbers) {
      const caseToUpdate = await applicationContext
        .getPersistenceGateway()
        .getCaseByDocketNumber({
          applicationContext,
          docketNumber,
        });

      caseEntities.push(new Case(caseToUpdate, { applicationContext }));
    }

    caseEntities = await Promise.all(
      caseEntities.map(caseEntity =>
        applicationContext.getUseCaseHelpers().fileDocumentOnOneCase({
          applicationContext,
          caseEntity,
          form,
          numberOfPages,
          originalSubjectDocketEntry,
          user,
        }),
      ),
    );

    serviceResults = await applicationContext
      .getUseCaseHelpers()
      .serveDocumentAndGetPaperServicePdf({
        applicationContext,
        caseEntities,
        docketEntryId: originalSubjectDocketEntry.docketEntryId,
        stampedPdf,
      });
  } finally {
    for (const caseEntity of caseEntities) {
      try {
        await applicationContext
          .getPersistenceGateway()
          .updateDocketEntryPendingServiceStatus({
            applicationContext,
            docketEntryId: originalSubjectDocketEntry.docketEntryId,
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
    key: originalSubjectDocketEntry.docketEntryId,
  });

  const successMessage =
    docketNumbers.length > 1
      ? 'Document served to selected cases in group.'
      : 'Document served.';

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

const stampDocument = async ({ applicationContext, form, pdfData }) => {
  const servedAt = createISODateString();

  let serviceStampType = 'Served';

  if (form.documentType === GENERIC_ORDER_DOCUMENT_TYPE) {
    serviceStampType = form.serviceStamp;
  } else if (ENTERED_AND_SERVED_EVENT_CODES.includes(form.eventCode)) {
    serviceStampType = 'Entered and Served';
  }

  const serviceStampDate = formatDateString(servedAt, 'MMDDYY');

  return await applicationContext.getUseCaseHelpers().addServedStampToDocument({
    applicationContext,
    pdfData,
    serviceStampText: `${serviceStampType} ${serviceStampDate}`,
  });
};
