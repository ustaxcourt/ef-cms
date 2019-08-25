const {
  BATCH_DOWNLOAD_TRIAL_SESSION,
  isAuthorized,
} = require('../../../authorization/authorizationClientService');
const {
  generatePdfFromHtml,
} = require('../../useCaseHelper/pdf/generatePdfFromHtml');
const { s3Zip } = require('../../useCaseHelper/zip/s3-zip');
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
  caseHtml,
  trialSessionId,
}) => {
  const user = applicationContext.getCurrentUser();

  if (!isAuthorized(user, BATCH_DOWNLOAD_TRIAL_SESSION)) {
    throw new UnauthorizedError('Unauthorized');
  }

  const sessionCases = await applicationContext
    .getPersistenceGateway()
    .getCalendaredCasesForTrialSession({
      applicationContext,
      trialSessionId,
    });

  let s3Ids = [];
  let fileNames = [];

  sessionCases.forEach(caseToBatch => {
    caseToBatch.documents.forEach(document => {
      if (document.documentType === 'Petition') {
        s3Ids.push(document.documentId);
        fileNames.push(
          `${caseToBatch.docketNumber}/${document.documentType}.pdf`,
        );
      }
    });
  });

  const { region } = applicationContext.environment;
  const bucket = applicationContext.environment.documentsBucketName;
  const s3Client = applicationContext.getStorageClient();

  s3Zip.setArchiverOptions({ gzip: false });
  const archive = s3Zip.initArchive();

  let docketRecordPdf;
  for (let index = 0; index < sessionCases.length; index++) {
    let { caseId, docketNumber } = sessionCases[index];

    docketRecordPdf = await generatePdfFromHtml({
      applicationContext,
      contentHtml: caseHtml[caseId],
      docketNumber,
    });

    archive.append(docketRecordPdf, {
      name: `${docketNumber}/Docket Record.pdf`,
    });
  }

  return s3Zip.archive(
    { bucket: bucket, region: region, s3: s3Client },
    '',
    s3Ids,
    fileNames,
  );
};
