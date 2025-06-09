import { ALLOWLIST_FEATURE_FLAGS } from '@shared/business/entities/EntityConstants';
import {
  AuthUser,
  UnknownAuthUser,
} from '@shared/business/entities/authUser/AuthUser';
import { Case } from '@shared/business/entities/cases/Case';
import { NotFoundError } from '../../../errors/errors';
import { ProgressData } from '@web-api/persistence/s3/zipDocuments';
import {
  ROLE_PERMISSIONS,
  isAuthorized,
} from '@shared/authorization/authorizationClientService';
import { ServerApplicationContext } from '@web-api/applicationContext';
import { UnauthorizedError } from '@web-api/errors/errors';
import { generateValidDocketEntryFilename } from '@web-api/business/useCases/trialSessions/batchDownloadTrialSessionInteractor';
import { getCaseByDocketNumber } from '@web-api/persistence/postgres/cases/getCaseByDocketNumber';

export type DownloadDocketEntryRequestType = {
  documentsSelectedForDownload: string[];
  clientConnectionId: string;
  docketNumber: string;
  printableDocketRecordFileId?: string;
};

export const batchDownloadDocketEntriesInteractor = async (
  applicationContext: ServerApplicationContext,
  downloadDocketEntryRequestInfo: DownloadDocketEntryRequestType,
  authorizedUser: UnknownAuthUser,
) => {
  try {
    await batchDownloadDocketEntriesHelper(
      applicationContext,
      downloadDocketEntryRequestInfo,
      authorizedUser,
    );
  } catch (error: any) {
    const { userId } = authorizedUser;
    const { clientConnectionId, docketNumber } = downloadDocketEntryRequestInfo;

    const erMsg = error.message || 'unknown error';
    applicationContext.logger.error(
      `Error batch-downloading documents from case: ${docketNumber} - ${erMsg}`,
      { error },
    );
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
};

const batchDownloadDocketEntriesHelper = async (
  applicationContext: ServerApplicationContext,
  {
    clientConnectionId,
    docketNumber,
    documentsSelectedForDownload,
    printableDocketRecordFileId,
  }: DownloadDocketEntryRequestType,
  authorizedUser: UnknownAuthUser,
): Promise<void> => {
  if (
    !isAuthorized(
      authorizedUser,
      ROLE_PERMISSIONS.BATCH_DOWNLOAD_CASE_DOCUMENTS,
    )
  ) {
    throw new UnauthorizedError('Unauthorized');
  }

  const caseToBatch = await getCaseByDocketNumber({
    applicationContext,
    docketNumber,
  });

  if (!caseToBatch) {
    throw new NotFoundError(`Case: ${docketNumber} was not found.`);
  }

  const { caseCaption, isSealed: isCaseSealed } = caseToBatch;
  const caseTitle = Case.getCaseTitle(caseCaption);
  const caseFolder = `${docketNumber}, ${caseTitle}`;
  const zipName = `${caseFolder}.zip`;
  const documentsToZip: {
    key: string;
    filePathInZip: string;
    useTempBucket: boolean;
  }[] = [];

  const caseEntity = new Case(caseToBatch, { authorizedUser });

  documentsSelectedForDownload.forEach(docketEntryId => {
    const docInfo = caseEntity.getDocketEntryById({
      docketEntryId,
    });

    const { documentTitle, filingDate, index } = docInfo;
    const filename = generateValidDocketEntryFilename({
      documentTitle,
      filingDate,
      index,
    });

    const fileDirectory =
      isCaseSealed || docInfo.isSealed ? `${caseFolder}/sealed` : caseFolder;

    const pdfTitle = docInfo.isStricken ? `STRICKEN_${filename}` : filename;

    documentsToZip.push({
      filePathInZip: `${fileDirectory}/${pdfTitle}`,
      key: docketEntryId,
      useTempBucket: false,
    });
  });

  if (printableDocketRecordFileId) {
    const pdfTitle = `${caseFolder}/${'0_Docket_Record.pdf'}`;

    documentsToZip.push({
      filePathInZip: pdfTitle,
      key: printableDocketRecordFileId,
      useTempBucket: true,
    });
  }

  const featureFlags = await applicationContext
    .getUseCases()
    .getAllFeatureFlagsFromPostgresInteractor(applicationContext, true);

  const awsBatchMinimumCount =
    featureFlags[ALLOWLIST_FEATURE_FLAGS.AWS_BATCH_ZIPPER_MINIMUM_COUNT.key];

  const useAwsBatchMechanism =
    applicationContext.environment.stage !== 'local' &&
    !!awsBatchMinimumCount &&
    documentsToZip.length > awsBatchMinimumCount;

  if (useAwsBatchMechanism) {
    const UUID = applicationContext.getUniqueId();
    await applicationContext.getPersistenceGateway().uploadDocument({
      applicationContext,
      pdfData: JSON.stringify(documentsToZip),
      pdfName: UUID,
      useTempBucket: true,
    });

    await applicationContext
      .getDispatchers()
      .sendZipperBatchJob(
        applicationContext,
        UUID,
        zipName,
        clientConnectionId,
        authorizedUser.userId,
      );

    await displayFakeProgressBarUntilBatchBootsUp(
      applicationContext,
      clientConnectionId,
      authorizedUser,
    );

    return;
  }

  await applicationContext.getNotificationGateway().sendNotificationToUser({
    applicationContext,
    clientConnectionId,
    message: {
      action: 'batch_download_progress',
      filesCompleted: 0,
      totalFiles: documentsSelectedForDownload.length,
    },
    userId: authorizedUser.userId,
  });

  const onProgress = async (progressData: ProgressData) => {
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

async function displayFakeProgressBarUntilBatchBootsUp(
  applicationContext: ServerApplicationContext,
  clientConnectionId: string,
  authorizedUser: AuthUser,
) {
  const FAKE_NUMBER = 45;
  for (let index = 0; index < FAKE_NUMBER; index++) {
    await applicationContext.getNotificationGateway().sendNotificationToUser({
      applicationContext,
      clientConnectionId,
      message: {
        action: 'aws_batch_download_progress',
        filesCompleted: index,
        totalFiles: FAKE_NUMBER,
      },
      userId: authorizedUser.userId,
    });
    await new Promise(resolve => setTimeout(() => resolve(null), 1000));
  }
}
