import {
  Case,
  isClosed,
} from '../../../../../shared/src/business/entities/cases/Case';
import {
  FORMATS,
  formatDateString,
} from '../../../../../shared/src/business/utilities/DateHandler';
import { NotFoundError } from '../../../errors/errors';
import { ProgressData } from '@web-api/persistence/s3/zipDocuments';
import {
  ROLE_PERMISSIONS,
  isAuthorized,
} from '../../../../../shared/src/authorization/authorizationClientService';
import { ServerApplicationContext } from '@web-api/applicationContext';
import { UnauthorizedError } from '@web-api/errors/errors';
import { padStart } from 'lodash';
import sanitize from 'sanitize-filename';

export const batchDownloadTrialSessionInteractor = async (
  applicationContext: ServerApplicationContext,
  { trialSessionId }: { trialSessionId: string },
): Promise<void> => {
  try {
    await batchDownloadTrialSessionInteractorHelper(applicationContext, {
      trialSessionId,
    });
  } catch (error: any) {
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

const batchDownloadTrialSessionInteractorHelper = async (
  applicationContext: ServerApplicationContext,
  { trialSessionId }: { trialSessionId: string },
): Promise<void> => {
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

  const documentsToZip: {
    key: string;
    filePathInZip: string;
    useTempBucket: boolean;
  }[] = [];

  for (const caseToBatch of batchableSessionCases) {
    const docketEntriesWithFileAttached = caseToBatch.docketEntries.filter(
      d => d.isOnDocketRecord && d.isFileAttached,
    );

    for (const docketEntry of docketEntriesWithFileAttached) {
      if (!docketEntry.docketEntryId) continue;

      const filename = generateValidDocketEntryFilename(docketEntry);
      const pdfTitle = `${caseToBatch.caseFolder}/${filename}`;
      documentsToZip.push({
        filePathInZip: pdfTitle,
        key: docketEntry.docketEntryId,
        useTempBucket: false,
      });
    }
  }

  let numberOfDocketRecordsGenerated = 0;
  const numberOfDocketRecordsToGenerate = batchableSessionCases.length;

  const onDocketRecordCreation = async ({
    docketNumber,
  }: {
    docketNumber?: string;
  }) => {
    if (docketNumber) {
      numberOfDocketRecordsGenerated += 1;
    }
    await applicationContext.getNotificationGateway().sendNotificationToUser({
      applicationContext,
      message: {
        action: 'batch_download_docket_generated',
        filesCompleted: numberOfDocketRecordsGenerated,
        totalFiles: numberOfDocketRecordsToGenerate,
      },
      userId: user.userId,
    });
  };

  await onDocketRecordCreation({ docketNumber: undefined });

  for (const sessionCase of batchableSessionCases) {
    const result = await applicationContext
      .getUseCases()
      .generateDocketRecordPdfInteractor(applicationContext, {
        docketNumber: sessionCase.docketNumber,
        includePartyDetail: true,
      });

    await onDocketRecordCreation({ docketNumber: sessionCase.docketNumber });

    documentsToZip.push({
      filePathInZip: `${sessionCase.caseFolder}/0_Docket Record.pdf`,
      key: result.fileId,
      useTempBucket: true,
    });
  }

  const onProgress = async (progressData: ProgressData): Promise<void> => {
    await applicationContext.getNotificationGateway().sendNotificationToUser({
      applicationContext,
      message: {
        action: 'batch_download_progress',
        filesCompleted: progressData.filesCompleted,
        totalFiles: progressData.totalFiles,
      },
      userId: user.userId,
    });
  };

  await applicationContext.getNotificationGateway().sendNotificationToUser({
    applicationContext,
    message: {
      action: 'batch_download_progress',
      filesCompleted: 0,
      totalFiles: documentsToZip.length,
    },
    userId: user.userId,
  });

  const trialDate = formatDateString(
    trialSessionDetails.startDate,
    FORMATS.FILENAME_DATE,
  );
  const zipName = sanitize(
    `${trialDate}-${trialSessionDetails.trialLocation}.zip`,
  )
    .replace(/\s/g, '_')
    .replace(/,/g, '');

  await applicationContext
    .getPersistenceGateway()
    .zipDocuments(applicationContext, {
      documents: documentsToZip,
      onProgress,
      outputZipName: zipName,
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
}: {
  documentTitle: string;
  filingDate: string;
  index: string;
}): string => {
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
