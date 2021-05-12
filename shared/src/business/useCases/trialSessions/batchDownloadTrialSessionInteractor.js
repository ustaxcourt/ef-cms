const sanitize = require('sanitize-filename');
const {
  isAuthorized,
  ROLE_PERMISSIONS,
} = require('../../../authorization/authorizationClientService');
const { Case } = require('../../entities/cases/Case');
const { CASE_STATUS_TYPES } = require('../../entities/EntityConstants');
const { formatDateString } = require('../../utilities/DateHandler');
const { padStart } = require('lodash');
const { UnauthorizedError } = require('../../../errors/errors');

/**
 * batchDownloadTrialSessionInteractor
 *
 * @param {object} applicationContext the application context
 * @param {object} providers the providers object
 * @param {string} providers.trialSessionId the id of the trial session
 * @returns {Promise} the promise of the batchDownloadTrialSessionInteractor call
 */
const batchDownloadTrialSessionInteractor = async (
  applicationContext,
  { trialSessionId, verifyFiles = false },
) => {
  const user = applicationContext.getCurrentUser();

  if (!isAuthorized(user, ROLE_PERMISSIONS.BATCH_DOWNLOAD_TRIAL_SESSION)) {
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
    'MMMM_D_YYYY',
  );
  const { trialLocation } = trialSessionDetails;
  let zipName = sanitize(`${trialDate}-${trialLocation}.zip`)
    .replace(/\s/g, '_')
    .replace(/,/g, '');

  sessionCases = sessionCases
    .filter(
      caseToFilter =>
        caseToFilter.status !== CASE_STATUS_TYPES.closed &&
        !caseToFilter.removedFromTrial,
    )
    .map(caseToBatch => {
      const caseTitle = Case.getCaseTitle(caseToBatch.caseCaption);
      const caseFolder = `${caseToBatch.docketNumber}, ${caseTitle}`;

      return {
        ...caseToBatch,
        caseFolder,
        caseTitle,
      };
    });

  for (const caseToBatch of sessionCases) {
    const docketEntriesOnDocketRecord = caseToBatch.docketEntries.filter(
      d => d.isOnDocketRecord && d.isFileAttached,
    );

    const documentMap = docketEntriesOnDocketRecord.reduce((acc, doc) => {
      acc[doc.docketEntryId] = doc;
      return acc;
    }, {});

    for (const aDocketRecord of docketEntriesOnDocketRecord) {
      let myDoc;
      if (
        aDocketRecord.docketEntryId &&
        (myDoc = documentMap[aDocketRecord.docketEntryId])
      ) {
        // check that all file exists before continuing
        if (verifyFiles) {
          const isFileExists = await applicationContext
            .getPersistenceGateway()
            .isFileExists({
              applicationContext,
              key: aDocketRecord.docketEntryId,
            });

          if (!isFileExists) {
            throw new Error(
              `Batch Download Error: File ${aDocketRecord.docketEntryId} for case ${caseToBatch.docketNumber} does not exist!`,
            );
          }
        }

        const filename =
          exports.generateValidDocketEntryFilename(aDocketRecord);
        const pdfTitle = `${caseToBatch.caseFolder}/${filename}`;
        s3Ids.push(myDoc.docketEntryId);
        fileNames.push(pdfTitle);
      }
    }
  }

  let numberOfDocketRecordsGenerated = 0;
  const numberOfDocketRecordsToGenerate = sessionCases.length;
  const numberOfFilesToBatch = numberOfDocketRecordsToGenerate + s3Ids.length;

  const onDocketRecordCreation = async docketNumber => {
    if (docketNumber) {
      numberOfDocketRecordsGenerated += 1;
    }
    await applicationContext.getNotificationGateway().sendNotificationToUser({
      applicationContext,
      message: {
        action: 'batch_download_docket_generated',
        docketNumber,
        numberOfDocketRecordsGenerated,
        numberOfDocketRecordsToGenerate,
        numberOfFilesToBatch,
      },
      userId: user.userId,
    });
  };

  await onDocketRecordCreation();

  const generateDocumentAndDocketRecordForCase = async sessionCase => {
    const result = await applicationContext
      .getUseCases()
      .generateDocketRecordPdfInteractor(applicationContext, {
        docketNumber: sessionCase.docketNumber,
        includePartyDetail: true,
      });

    const doc = await applicationContext.getPersistenceGateway().getDocument({
      applicationContext,
      docketNumber: sessionCase.docketNumber,
      key: result.fileId,
      protocol: 'S3',
      useTempBucket: true,
    });

    await onDocketRecordCreation({ docketNumber: sessionCase.docketNumber });

    extraFiles.push(doc);

    extraFileNames.push(`${sessionCase.caseFolder}/0_Docket Record.pdf`);
  };

  for (const sessionCase of sessionCases) {
    await generateDocumentAndDocketRecordForCase(sessionCase);
  }

  const onEntry = entryData => {
    applicationContext.getNotificationGateway().sendNotificationToUser({
      applicationContext,
      message: {
        action: 'batch_download_entry',
        ...entryData,
        numberOfDocketRecordsToGenerate,
        numberOfFilesToBatch,
      },
      userId: user.userId,
    });
  };

  const onError = error => {
    applicationContext.logger.error('Archive Error', { error });
    applicationContext.getNotificationGateway().sendNotificationToUser({
      applicationContext,
      message: {
        action: 'batch_download_error',
        error,
      },
      userId: user.userId,
    });
  };

  const onProgress = progressData => {
    applicationContext.getNotificationGateway().sendNotificationToUser({
      applicationContext,
      message: {
        action: 'batch_download_progress',
        ...progressData,
        numberOfDocketRecordsToGenerate,
        numberOfFilesToBatch,
      },
      userId: user.userId,
    });
  };

  const onUploadStart = () => {
    applicationContext.getNotificationGateway().sendNotificationToUser({
      applicationContext,
      message: {
        action: 'batch_download_upload_start',
        numberOfDocketRecordsToGenerate,
        numberOfFilesToBatch,
      },
      userId: user.userId,
    });
  };

  await applicationContext.getPersistenceGateway().zipDocuments({
    applicationContext,
    extraFileNames,
    extraFiles,
    fileNames,
    onEntry,
    onError,
    onProgress,
    onUploadStart,
    s3Ids,
    uploadToTempBucket: true,
    zipName,
  });

  const { url } = await applicationContext
    .getPersistenceGateway()
    .getDownloadPolicyUrl({
      applicationContext,
      key: zipName,
      useTempBucket: true,
    });

  await applicationContext.getNotificationGateway().sendNotificationToUser({
    applicationContext,
    message: {
      action: 'batch_download_ready',
      url,
    },
    userId: user.userId,
  });
};

exports.generateValidDocketEntryFilename = ({
  documentTitle,
  filingDate,
  index,
}) => {
  const MAX_OVERALL_FILE_LENGTH = 200;
  const EXTENSION = '.pdf';
  const VALID_FILE_NAME_MAX_LENGTH = MAX_OVERALL_FILE_LENGTH - EXTENSION.length;

  const docDate = formatDateString(filingDate, 'YYYY-MM-DD');
  const docNum = padStart(`${index}`, 4, '0');
  let fileName = sanitize(`${docDate}_${docNum}_${documentTitle}`);
  if (fileName.length > VALID_FILE_NAME_MAX_LENGTH) {
    fileName = fileName.substring(0, VALID_FILE_NAME_MAX_LENGTH);
  }
  return `${fileName}${EXTENSION}`;
};

/**
 * batchDownloadTrialSessionInteractor
 *
 * @param {object} applicationContext the application context
 * @param {object} providers the providers object
 * @param {string} providers.trialSessionId the id of the trial session
 * @returns {Promise} the promise of the batchDownloadTrialSessionInteractor call
 */
exports.batchDownloadTrialSessionInteractor = async (
  applicationContext,
  { trialSessionId, verifyFiles = false },
) => {
  try {
    await batchDownloadTrialSessionInteractor(applicationContext, {
      trialSessionId,
      verifyFiles,
    });
  } catch (error) {
    const { userId } = applicationContext.getCurrentUser();

    applicationContext.logger.error(
      `Error when batch downloading trial session with id ${trialSessionId}`,
      { error },
    );
    await applicationContext.getNotificationGateway().sendNotificationToUser({
      applicationContext,
      message: {
        action: 'batch_download_error',
        error,
      },
      userId,
    });
  }
};
