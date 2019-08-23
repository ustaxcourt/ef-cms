const sanitize = require('sanitize-filename');
const {
  BATCH_DOWNLOAD_TRIAL_SESSION,
  isAuthorized,
} = require('../../../authorization/authorizationClientService');
const { formatDateString } = require('../../../business/utilities/DateHandler');
const { UnauthorizedError } = require('../../../errors/errors');

/**
 * batchDownloadTrialSessionInteractor
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {string} providers.trialSessionId the id of the trial session
 * @returns {Promise} the promise of the batchDownloadTrialSessionInteractor call
 */
exports.batchDownloadTrialSessionInteractor = async ({
  applicationContext,
  trialSessionId,
}) => {
  const user = applicationContext.getCurrentUser();

  if (!isAuthorized(user, BATCH_DOWNLOAD_TRIAL_SESSION)) {
    throw new UnauthorizedError('Unauthorized');
  }

  const trialSessionDetails = await applicationContext
    .getPersistenceGateway()
    .getTrialSessionById({
      applicationContext,
      trialSessionId,
    });

  const s3Ids = [];
  const fileNames = [];

  const zipName = sanitize(
    `${(formatDateString(trialSessionDetails.startDate),
    'MMMM_D_YYYY')}_${trialSessionDetails.trialLocation
      .replace(/\s/g, '_')
      .replace(/,/g, '')}.zip`,
  );

  await applicationContext.getPersistenceGateway().zipDocuments({
    applicationContext,
    fileNames,
    s3Ids,
    zipName,
  });

  const results = await applicationContext
    .getPersistenceGateway()
    .getDownloadPolicyUrl({
      applicationContext,
      documentId: zipName,
    });

  return results;
};
