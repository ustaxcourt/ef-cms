import { Case } from '@shared/business/entities/cases/Case';
import {
  FORMATS,
  formatDateString,
} from '@shared/business/utilities/DateHandler';
import { NotFoundError } from '../../../errors/errors';
import { ProgressData } from '@web-api/persistence/s3/zipDocuments';
import {
  ROLE_PERMISSIONS,
  isAuthorized,
} from '@shared/authorization/authorizationClientService';
import { ServerApplicationContext } from '@web-api/applicationContext';
import { UnauthorizedError } from '@web-api/errors/errors';
import { UnknownAuthUser } from '@shared/business/entities/authUser/AuthUser';
import { padStart } from 'lodash';
import sanitize from 'sanitize-filename';
import { getTrialSessionById } from '@web-api/persistence/postgres/trialSessions/getTrialSessionById';
import { getCalendaredCasesForTrialSession } from '@web-api/persistence/postgres/trialSessions/getCalendaredCasesForTrialSession';
import { ALLOWLIST_FEATURE_FLAGS } from '@shared/business/entities/EntityConstants';
import { pollAWSBatchProgress } from '@web-api/dispatchers/batch/pollAWSBatchProgress';

export const batchDownloadTrialSessionInteractor = async (
  applicationContext: ServerApplicationContext,
  {
    trialSessionId,
    clientConnectionId,
  }: { trialSessionId: string; clientConnectionId: string },
  authorizedUser: UnknownAuthUser,
): Promise<void> => {
  try {
    await batchDownloadTrialSessionInteractorHelper(
      applicationContext,
      {
        trialSessionId,
        clientConnectionId,
      },
      authorizedUser,
    );
  } catch (error: any) {
    const userId = authorizedUser?.userId;

    const erMsg = error.message || 'unknown error';
    applicationContext.logger.error(
      `Error when batch downloading trial session with id ${trialSessionId} - ${erMsg}`,
      { error },
    );
    if (userId) {
      await applicationContext.getNotificationGateway().sendNotificationToUser({
        applicationContext,
        clientConnectionId,
        message: {
          action: 'batch_download_error',
          error,
        },
        userId,
      });
    }
  }
};

export const batchDownloadTrialSessionInteractorHelper = async (
  applicationContext: ServerApplicationContext,
  {
    trialSessionId,
    clientConnectionId,
  }: { trialSessionId: string; clientConnectionId: string },
  authorizedUser: UnknownAuthUser,
): Promise<void> => {
  if (
    !isAuthorized(authorizedUser, ROLE_PERMISSIONS.BATCH_DOWNLOAD_TRIAL_SESSION)
  ) {
    throw new UnauthorizedError('Unauthorized');
  }

  const trialSessionDetails = await getTrialSessionById({
    trialSessionId,
  });

  if (!trialSessionDetails) {
    throw new NotFoundError(`Trial session ${trialSessionId} was not found.`);
  }

  const allSessionCases = await getCalendaredCasesForTrialSession({
    trialSessionId,
  });

  const batchableSessionCases = allSessionCases
    .filter(caseToFilter => !caseToFilter.removedFromTrial)
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

      // @ts-ignore
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

  applicationContext.logger.info('Generating file');

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
      clientConnectionId,
      message: {
        action: 'batch_download_docket_generated',
        filesCompleted: numberOfDocketRecordsGenerated,
        totalFiles: numberOfDocketRecordsToGenerate,
      },
      userId: authorizedUser.userId,
    });
  };

  await onDocketRecordCreation({ docketNumber: undefined });

  for (const sessionCase of batchableSessionCases) {
    const result = await applicationContext
      .getUseCases()
      .generateDocketRecordPdfInteractor(
        applicationContext,
        {
          docketNumber: sessionCase.docketNumber,
          includePartyDetail: true,
        },
        authorizedUser,
      );

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
      clientConnectionId,
      message: {
        action: 'batch_download_progress',
        filesCompleted: progressData.filesCompleted,
        totalFiles: progressData.totalFiles,
      },
      userId: authorizedUser.userId,
    });
  };

  await applicationContext.getNotificationGateway().sendNotificationToUser({
    applicationContext,
    clientConnectionId,
    message: {
      action: 'batch_download_progress',
      filesCompleted: 0,
      totalFiles: documentsToZip.length,
    },
    userId: authorizedUser.userId,
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

  const featureFlags = await applicationContext
    .getUseCases()
    .getAllFeatureFlagsInteractor(applicationContext, true);

  const awsBatchMinimumCount =
    featureFlags[ALLOWLIST_FEATURE_FLAGS.AWS_BATCH_ZIPPER_MINIMUM_COUNT.key];

  const useAwsBatchMechanism =
    applicationContext.environment.stage !== 'local' &&
    !!awsBatchMinimumCount &&
    documentsToZip.length > awsBatchMinimumCount;

  try {
    if (useAwsBatchMechanism) {
      applicationContext.logger.info('Starting batch job');
      const UUID = applicationContext.getUniqueId();
      await applicationContext.getPersistenceGateway().uploadDocument({
        applicationContext,
        pdfData: JSON.stringify(documentsToZip),
        key: UUID,
        useTempBucket: true,
      });

      const response = await applicationContext
        .getDispatchers()
        .sendZipperBatchJob(
          applicationContext,
          UUID,
          zipName,
          clientConnectionId,
          authorizedUser.userId,
        );

      await pollAWSBatchProgress({
        applicationContext,
        jobId: response.jobId as string,
        onProgress,
      });

      return;
    }
  } catch (error) {
    throw new Error(`Error starting AWS batch job: ${error}`);
  }

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
    clientConnectionId,
    message: {
      action: 'batch_download_ready',
      url,
    },
    userId: authorizedUser.userId,
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
