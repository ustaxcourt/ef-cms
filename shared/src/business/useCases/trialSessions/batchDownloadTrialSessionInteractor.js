const sanitize = require('sanitize-filename');
// const stream = require('stream');
const {
  BATCH_DOWNLOAD_TRIAL_SESSION,
  isAuthorized,
} = require('../../../authorization/authorizationClientService');
// const {
//   generatePdfFromHtml,
// } = require('../../useCaseHelper/pdf/generatePdfFromHtml');
const { formatDateString } = require('../../../business/utilities/DateHandler');
// const { s3Zip } = require('../../useCaseHelper/zip/s3-zip');
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
  console.log(caseHtml);
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

  const trialSessionDetails = await applicationContext
    .getPersistenceGateway()
    .getTrialSessionById({
      applicationContext,
      trialSessionId,
    });

  let s3Ids = [];
  let fileNames = [];

  const trialDate = applicationContext
    .getUtilities()
    .formatDateString(trialSessionDetails.startDate, 'MMMM_D_YYYY');

  const trialLocation = trialSessionDetails.trialLocation
    .replace(/\s/g, '_')
    .replace(/,/g, '');

  const zipName = sanitize(`${trialDate}_${trialLocation}.zip`);

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

  //return archive.finalize();

  // let myArchive;
  // myArchive = s3Zip.setArchiverOptions({ gzip: false }).initArchive();

  // let docketRecordPdf;
  // for (let index = 0; index < sessionCases.length; index++) {
  //   let { caseId, docketNumber } = sessionCases[index];

  //   docketRecordPdf = await generatePdfFromHtml({
  //     applicationContext,
  //     contentHtml: caseHtml[caseId],
  //     docketNumber,
  //   });

  //   myArchive.archive.append(docketRecordPdf, {
  //     name: `${docketNumber}/Docket Record.pdf`,
  //   });
  // }

  // await new Promise((resolve, reject) => {
  //   const { region } = applicationContext.environment;
  //   const bucket = applicationContext.environment.documentsBucketName;
  //   const s3Client = applicationContext.getStorageClient();

  //   const uploadFromStream = s3Client => {
  //     const pass = new stream.PassThrough();

  //     const params = {
  //       Body: pass,
  //       Bucket: bucket,
  //       Key: zipName,
  //     };
  //     s3Client.upload(params, function() {});

  //     pass.on('finish', () => {
  //       resolve();
  //     });

  //     pass.on('error', reject);

  //     return pass;
  //   };

  //   s3Zip
  //     .setArchiverOptions({ gzip: false })
  //     .archive(
  //       { bucket: bucket, region: region, s3: s3Client },
  //       '',
  //       s3Ids,
  //       fileNames,
  //     )
  //     .pipe(uploadFromStream(s3Client));
  // });

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

  console.log(results);

  return results;
};
