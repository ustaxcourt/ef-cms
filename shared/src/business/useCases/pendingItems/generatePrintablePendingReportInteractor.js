const {
  isAuthorized,
  ROLE_PERMISSIONS,
} = require('../../../authorization/authorizationClientService');
const { UnauthorizedError } = require('../../../errors/errors');

/**
 * generatePrintablePendingReportInteractor
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {string} providers.judge the optional judge filter
 * @param {string} providers.caseId the optional caseId filter
 * @returns {Array} the url of the document
 */
exports.generatePrintablePendingReportInteractor = async ({
  applicationContext,
  caseId,
  judge,
}) => {
  const authorizedUser = applicationContext.getCurrentUser();

  if (!isAuthorized(authorizedUser, ROLE_PERMISSIONS.PENDING_ITEMS)) {
    throw new UnauthorizedError('Unauthorized');
  }

  if (judge) {
    judge = decodeURIComponent(judge);
  }

  const pendingItems = await applicationContext
    .getUseCaseHelpers()
    .fetchPendingItems({ applicationContext, caseId, judge });

  const formattedPendingItems = pendingItems.map(pendingItem => ({
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
  }));

  let reportTitle = 'All Judges';

  if (judge) {
    reportTitle = `Judge ${judge}`;
  } else if (caseId) {
    const caseResult = await applicationContext
      .getPersistenceGateway()
      .getCaseByCaseId({
        applicationContext,
        caseId,
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

  const documentId = `pending-report-${applicationContext.getUniqueId()}.pdf`;

  await new Promise(resolve => {
    const documentsBucket =
      applicationContext.environment.tempDocumentsBucketName;
    const s3Client = applicationContext.getStorageClient();

    const params = {
      Body: pdf,
      Bucket: documentsBucket,
      ContentType: 'application/pdf',
      Key: documentId,
    };

    s3Client.upload(params, function () {
      resolve();
    });
  });

  const {
    url,
  } = await applicationContext.getPersistenceGateway().getDownloadPolicyUrl({
    applicationContext,
    documentId,
    useTempBucket: true,
  });

  return url;
};
