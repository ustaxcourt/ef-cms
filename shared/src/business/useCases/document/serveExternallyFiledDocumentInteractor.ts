import { Case } from '../../entities/cases/Case';
import {
  DOCUMENT_PROCESSING_STATUS_OPTIONS,
  DOCUMENT_SERVED_MESSAGES,
} from '../../entities/EntityConstants';
import { DocketEntry } from '../../entities/DocketEntry';
import { NotFoundError, UnauthorizedError } from '../../../errors/errors';
import {
  ROLE_PERMISSIONS,
  isAuthorized,
} from '../../../authorization/authorizationClientService';
import { addCoverToPdf } from '../addCoverToPdf';

/**
 * serveExternallyFiledDocumentInteractor
 *
 * @param {Object} applicationContext the application context
 * @param {Object} providers the providers object
 * @param {object} providers.clientConnectionId the client connection Id
 * @param {String} providers.docketEntryId the ID of the docket entry being filed and served
 * @param {String[]} providers.docketNumbers the docket numbers that this docket entry needs to be filed and served on, will be one or more docket numbers
 * @param {String} providers.subjectCaseDocketNumber the docket number that initiated the filing and service
 */
export const serveExternallyFiledDocumentInteractor = async (
  applicationContext: IApplicationContext,
  {
    clientConnectionId,
    docketEntryId,
    docketNumbers,
    subjectCaseDocketNumber,
  }: {
    clientConnectionId: string;
    docketEntryId: string;
    docketNumbers: string[];
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
  const coversheetLength = 1;

  caseEntities = await Promise.all(
    docketNumbers.map(async docketNumber => {
      const rawCaseToUpdate = await applicationContext
        .getPersistenceGateway()
        .getCaseByDocketNumber({
          applicationContext,
          docketNumber,
        });

      const caseEntityToUpdate = new Case(rawCaseToUpdate, {
        applicationContext,
      });

      const docketEntryEntity = new DocketEntry(
        {
          ...originalSubjectDocketEntry,
          docketNumber: caseEntityToUpdate.docketNumber,
          draftOrderState: null,
          filingDate: applicationContext.getUtilities().createISODateString(),
          isDraft: false,
          isFileAttached: true,
          isOnDocketRecord: true,
          numberOfPages: numberOfPages + coversheetLength,
          processingStatus: DOCUMENT_PROCESSING_STATUS_OPTIONS.COMPLETE,
          userId: user.userId,
        },
        { applicationContext },
      );

      return applicationContext.getUseCaseHelpers().fileDocumentOnOneCase({
        applicationContext,
        caseEntity: caseEntityToUpdate,
        docketEntryEntity,
        subjectCaseDocketNumber,
        user,
      });
    }),
  );

  const updatedSubjectCaseEntity = caseEntities.find(
    c => c.docketNumber === subjectCaseDocketNumber,
  );
  const updatedSubjectDocketEntry = updatedSubjectCaseEntity.getDocketEntryById(
    { docketEntryId },
  );

  const { pdfData: pdfWithCoversheet } = await addCoverToPdf({
    applicationContext,
    caseEntity: updatedSubjectCaseEntity,
    docketEntryEntity: updatedSubjectDocketEntry,
    pdfData,
  });

  await applicationContext.getPersistenceGateway().saveDocumentFromLambda({
    applicationContext,
    document: pdfWithCoversheet,
    key: originalSubjectDocketEntry.docketEntryId,
  });

  const paperServiceResult = await applicationContext
    .getUseCaseHelpers()
    .serveDocumentAndGetPaperServicePdf({
      applicationContext,
      caseEntities,
      docketEntryId: originalSubjectDocketEntry.docketEntryId,
    });

  await Promise.all(
    caseEntities.map(caseEntity => {
      return applicationContext
        .getPersistenceGateway()
        .updateDocketEntryPendingServiceStatus({
          applicationContext,
          docketEntryId,
          docketNumber: caseEntity.docketNumber,
          status: false,
        });
    }),
  );

  const successMessage =
    docketNumbers.length > 1
      ? DOCUMENT_SERVED_MESSAGES.SELECTED_CASES
      : DOCUMENT_SERVED_MESSAGES.ENTRY_ADDED;

  await applicationContext.getNotificationGateway().sendNotificationToUser({
    applicationContext,
    clientConnectionId,
    message: {
      action: 'serve_document_complete',
      alertSuccess: {
        message: successMessage,
        overwritable: false,
      },
      pdfUrl: paperServiceResult && paperServiceResult.pdfUrl,
    },
    userId: user.userId,
  });
};
