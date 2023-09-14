import {
  ROLE_PERMISSIONS,
  isAuthorized,
} from '../../../authorization/authorizationClientService';
import { UNSERVABLE_EVENT_CODES } from '../../entities/EntityConstants';
import { UnauthorizedError } from '../../../../../web-api/src/errors/errors';

/**
 * generatePrintablePendingReportInteractor
 * @param {object} applicationContext the application context
 * @param {object} providers the providers object
 * @param {string} providers.judge the optional judge filter
 * @param {string} providers.docketNumber the optional docketNumber filter
 * @returns {Array} the url of the document
 */
export const generatePrintablePendingReportInteractor = async (
  applicationContext: IApplicationContext,
  { docketNumber, judge }: { docketNumber?: string; judge?: string },
) => {
  const authorizedUser = applicationContext.getCurrentUser();

  if (!isAuthorized(authorizedUser, ROLE_PERMISSIONS.PENDING_ITEMS)) {
    throw new UnauthorizedError('Unauthorized');
  }

  let pendingDocuments = [];

  if (docketNumber) {
    pendingDocuments = await applicationContext
      .getUseCaseHelpers()
      .fetchPendingItemsByDocketNumber({ applicationContext, docketNumber });
  } else {
    //depends on fetchPendingItems returning a list already sorted by receivedAt
    pendingDocuments = (
      await applicationContext.getPersistenceGateway().fetchPendingItems({
        applicationContext,
        judge,
        unservableEventCodes: UNSERVABLE_EVENT_CODES,
      })
    ).foundDocuments;
  }

  const formattedPendingItems = pendingDocuments.map(pendingItem => ({
    ...pendingItem,
    associatedJudgeFormatted: applicationContext
      .getUtilities()
      .formatJudgeName(pendingItem.associatedJudge),
    caseTitle: applicationContext.getCaseTitle(pendingItem.caseCaption || ''),
    docketNumberWithSuffix: `${pendingItem.docketNumber}${
      pendingItem.docketNumberSuffix || ''
    }`,
    formattedFiledDate: applicationContext
      .getUtilities()
      .formatDateString(pendingItem.receivedAt, 'MMDDYY'),
    formattedName: pendingItem.documentTitle || pendingItem.documentType,
    inConsolidatedGroup: !!pendingItem.leadDocketNumber,
    inLeadCase: applicationContext.getUtilities().isLeadCase(pendingItem),
  }));

  let reportTitle = 'All Judges';

  if (judge) {
    reportTitle = `Judge ${judge}`;
  } else if (docketNumber) {
    const caseResult = await applicationContext
      .getPersistenceGateway()
      .getCaseByDocketNumber({
        applicationContext,
        docketNumber,
      });
    reportTitle = `Docket ${caseResult.docketNumber}${
      caseResult.docketNumberSuffix || ''
    }`;
  }

  const pdf = await applicationContext.getDocumentGenerators().pendingReport({
    applicationContext,
    data: {
      pendingItems: formattedPendingItems,
      subtitle: reportTitle,
    },
  });

  const key = `pending-report-${applicationContext.getUniqueId()}.pdf`;

  await new Promise((resolve, reject) => {
    const documentsBucket =
      applicationContext.environment.tempDocumentsBucketName;
    const s3Client = applicationContext.getStorageClient();

    const params = {
      Body: pdf,
      Bucket: documentsBucket,
      ContentType: 'application/pdf',
      Key: key,
    };

    s3Client.upload(params, function (err) {
      if (err) {
        applicationContext.logger.error('error uploading to s3', err);
        reject(err);
      }
      resolve(undefined);
    });
  });

  const { url } = await applicationContext
    .getPersistenceGateway()
    .getDownloadPolicyUrl({
      applicationContext,
      key,
      useTempBucket: true,
    });

  return url;
};
