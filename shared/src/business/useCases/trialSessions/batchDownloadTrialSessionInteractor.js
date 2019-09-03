const sanitize = require('sanitize-filename');
const {
  BATCH_DOWNLOAD_TRIAL_SESSION,
  isAuthorized,
} = require('../../../authorization/authorizationClientService');
const { Case } = require('../../entities/cases/Case');
const { formatDateString } = require('../../../business/utilities/DateHandler');
const { padStart } = require('lodash');
const { UnauthorizedError } = require('../../../errors/errors');

/**
 * batchDownloadTrialSessionInteractor
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {string} providers.trialSessionId the id of the trial session
 * @param {string} providers.caseDetails the case details of the calendared cases
 * @returns {Promise} the promise of the batchDownloadTrialSessionInteractor call
 */
exports.batchDownloadTrialSessionInteractor = async ({
  applicationContext,
  caseDetails,
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

  let sessionCases = await applicationContext
    .getPersistenceGateway()
    .getCalendaredCasesForTrialSession({
      applicationContext,
      trialSessionId,
    });

  let s3Ids = [];
  let fileNames = [];
  let extraFiles = [];
  let extraFileNames = [];

  const trialDate = formatDateString(
    trialSessionDetails.startDate,
    'MMMM D, YYYY',
  );
  const { trialLocation } = trialSessionDetails;
  const zipName = sanitize(`${trialDate} - ${trialLocation}.zip`)
    .replace(/\s/g, '_')
    .replace(/,/g, '');

  sessionCases = sessionCases.map(caseToBatch => {
    const caseName = Case.getCaseCaptionNames(caseToBatch.caseCaption);
    const caseFolder = `${caseToBatch.docketNumber}, ${caseName}`;

    return {
      ...caseToBatch,
      caseName,
      caseFolder,
    };
  });

  sessionCases.forEach(caseToBatch => {
    const documentMap = caseToBatch.documents.reduce((acc, document) => {
      acc[document.documentId] = document;
      return acc;
    }, {});

    caseToBatch.docketRecord.forEach(aDocketRecord => {
      let myDoc;
      if (
        aDocketRecord.documentId &&
        (myDoc = documentMap[aDocketRecord.documentId])
      ) {
        const docDate = formatDateString(
          aDocketRecord.filingDate,
          'YYYY-MM-DD',
        );
        const docNum = padStart(`${aDocketRecord.index}`, 4, '0');
        const fileName = sanitize(
          `${docDate}_${docNum}_${aDocketRecord.description}.pdf`,
        );
        const pdfTitle = `${caseToBatch.caseFolder}/${fileName}`;
        s3Ids.push(myDoc.documentId);
        fileNames.push(pdfTitle);
      }
    });
  });

  for (let index = 0; index < sessionCases.length; index++) {
    let { caseId } = sessionCases[index];
    extraFiles.push(
      await applicationContext.getUseCases().generateDocketRecordPdfInteractor({
        applicationContext,
        caseDetail: caseDetails[caseId],
      }),
    );
    extraFileNames.push(`${sessionCases[index].caseFolder}/Docket Record.pdf`);
  }

  await applicationContext.getPersistenceGateway().zipDocuments({
    applicationContext,
    extraFileNames,
    extraFiles,
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
