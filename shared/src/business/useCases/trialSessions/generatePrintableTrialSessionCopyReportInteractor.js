const {
  isAuthorized,
  ROLE_PERMISSIONS,
} = require('../../../authorization/authorizationClientService');
const { UnauthorizedError } = require('../../../errors/errors');

/**
 * generatePrintableTrialSessionCopyReportInteractor
 *
 * @param {object} applicationContext the application context
 * @param {object} providers the providers object
 * @param {string} providers.judge the optional judge filter
 * @param {string} providers.docketNumber the optional docketNumber filter
 * @returns {Array} the url of the document
 */
exports.generatePrintableTrialSessionCopyReportInteractor = async (
  applicationContext,
  { formattedCases, formattedTrialSession },
) => {
  const authorizedUser = applicationContext.getCurrentUser();

  if (
    !isAuthorized(authorizedUser, ROLE_PERMISSIONS.TRIAL_SESSION_WORKING_COPY)
  ) {
    throw new UnauthorizedError('Unauthorized');
  }

  console.log('formattedCases*** ', formattedCases);

  const pdf = await applicationContext
    .getDocumentGenerators()
    .printableWorkingCopySessionList({
      applicationContext,
      data: {
        formattedCases,
        formattedTrialSession,
      },
    });

  const key = `trial-session-printable-copy-${applicationContext.getUniqueId()}.pdf`;

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
      resolve();
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
