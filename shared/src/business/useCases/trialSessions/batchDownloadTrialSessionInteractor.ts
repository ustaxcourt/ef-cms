import { Case, isClosed } from '../../entities/cases/Case';
import { FORMATS, formatDateString } from '../../utilities/DateHandler';
import { NotFoundError } from '../../../../../web-api/src/errors/errors';
import {
  ROLE_PERMISSIONS,
  isAuthorized,
} from '../../../authorization/authorizationClientService';
import { UnauthorizedError } from '@web-api/errors/errors';
import { padStart } from 'lodash';
import sanitize from 'sanitize-filename';

/**
 * batchDownloadTrialSessionInteractorHelper
 *
 * @param {object} applicationContext the application context
 * @param {object} providers the providers object
 * @param {string} providers.trialSessionId the id of the trial session
 * @returns {Promise} the promise of the batchDownloadTrialSessionInteractor call
 */
const batchDownloadTrialSessionInteractorHelper = async (
  applicationContext: IApplicationContext,
  { trialSessionId }: { trialSessionId: string },
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

  if (!trialSessionDetails) {
    throw new NotFoundError(`Trial session ${trialSessionId} was not found.`);
  }

  let allSessionCases = await applicationContext
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
    FORMATS.FILENAME_DATE,
  );
  const { trialLocation } = trialSessionDetails;
  let zipName = sanitize(`${trialDate}-${trialLocation}.zip`)
    .replace(/\s/g, '_')
    .replace(/,/g, '');

  const batchableSessionCases = allSessionCases
    .filter(
      caseToFilter => !isClosed(caseToFilter) && !caseToFilter.removedFromTrial,
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

  for (const caseToBatch of batchableSessionCases) {
    const docketEntriesWithFileAttached = caseToBatch.docketEntries.filter(
      d => d.isOnDocketRecord && d.isFileAttached,
    );

    for (const docketEntry of docketEntriesWithFileAttached) {
      if (!docketEntry.docketEntryId) continue;
      const filename = generateValidDocketEntryFilename(docketEntry);
      const pdfTitle = `${caseToBatch.caseFolder}/${filename}`;
      s3Ids.push(docketEntry.docketEntryId);
      fileNames.push(pdfTitle);
    }
  }

  let numberOfDocketRecordsGenerated = 0;
  const numberOfDocketRecordsToGenerate = batchableSessionCases.length;
  const numberOfFilesToBatch = numberOfDocketRecordsToGenerate + s3Ids.length;

  const onDocketRecordCreation = async ({
    docketNumber,
  }: {
    docketNumber: string;
  }) => {
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

  await onDocketRecordCreation({ docketNumber: undefined });

  const generateDocumentAndDocketRecordForCase = async sessionCase => {
    const result = await applicationContext
      .getUseCases()
      .generateDocketRecordPdfInteractor(applicationContext, {
        docketNumber: sessionCase.docketNumber,
        includePartyDetail: true,
      });

    const doc = await applicationContext.getPersistenceGateway().getDocument({
      applicationContext,
      key: result.fileId,
      useTempBucket: true,
    });

    await onDocketRecordCreation({ docketNumber: sessionCase.docketNumber });

    extraFiles.push(doc);

    extraFileNames.push(`${sessionCase.caseFolder}/0_Docket Record.pdf`);
  };

  for (const sessionCase of batchableSessionCases) {
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

export const generateValidDocketEntryFilename = ({
  documentTitle,
  filingDate,
  index,
}) => {
  const MAX_OVERALL_FILE_LENGTH = 64;
  const EXTENSION = '.pdf';
  const VALID_FILE_NAME_MAX_LENGTH = MAX_OVERALL_FILE_LENGTH - EXTENSION.length;

  const docDate = formatDateString(filingDate, FORMATS.YYYYMMDD);
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
 */
export const batchDownloadTrialSessionInteractor = async (
  applicationContext: IApplicationContext,
  { trialSessionId }: { trialSessionId: string },
) => {
  try {
    await batchDownloadTrialSessionInteractorHelper(applicationContext, {
      trialSessionId,
    });
  } catch (error) {
    const { userId } = applicationContext.getCurrentUser();

    const erMsg = error.message || 'unknown error';
    applicationContext.logger.error(
      `Error when batch downloading trial session with id ${trialSessionId} - ${erMsg}`,
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
