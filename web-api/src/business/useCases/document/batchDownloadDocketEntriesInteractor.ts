import { Case } from '../../../../../shared/src/business/entities/cases/Case';
import { NotFoundError } from '../../../errors/errors';
import { ProgressData } from '@web-api/persistence/s3/zipDocuments';
import {
  ROLE_PERMISSIONS,
  isAuthorized,
} from '../../../../../shared/src/authorization/authorizationClientService';
import { ServerApplicationContext } from '@web-api/applicationContext';
import { UnauthorizedError } from '@web-api/errors/errors';
import { UnknownAuthUser } from '@shared/business/entities/authUser/AuthUser';
import { generateValidDocketEntryFilename } from '@web-api/business/useCases/trialSessions/batchDownloadTrialSessionInteractor';

export type DownloadDocketEntryRequestType = {
  documentsSelectedForDownload: string[];
  clientConnectionId: string;
  docketNumber: string;
  printableDocketRecordFileId?: string;
  index: number;
  totalNumberOfBatches: number;
  totalNumberOfFiles: number;
  uuid: string;
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
    index: batchIndex,
    printableDocketRecordFileId,
    totalNumberOfBatches,
    totalNumberOfFiles,
    uuid,
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

  await applicationContext.getNotificationGateway().sendNotificationToUser({
    applicationContext,
    clientConnectionId,
    message: {
      action: 'docket_entries_batch_download_progress',
      filesCompleted: 0,
      index: batchIndex,
      totalFiles: totalNumberOfFiles,
      totalNumberOfBatches,
      uuid,
    },
    userId: authorizedUser.userId,
  });

  const caseToBatch = await applicationContext
    .getPersistenceGateway()
    .getCaseByDocketNumber({
      applicationContext,
      docketNumber,
    });

  if (!caseToBatch) {
    throw new NotFoundError(`Case: ${docketNumber} was not found.`);
  }

  const { caseCaption, isSealed: isCaseSealed } = caseToBatch;
  const caseTitle = Case.getCaseTitle(caseCaption);
  const caseFolder = `${docketNumber}, ${caseTitle}`;
  const zipName = `${uuid}-${batchIndex}.zip`;
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

  const onProgress = async (progressData: ProgressData) => {
    await applicationContext.getNotificationGateway().sendNotificationToUser({
      applicationContext,
      clientConnectionId,
      message: {
        action: 'docket_entries_batch_download_progress',
        filesCompleted: progressData.filesCompleted,
        index: batchIndex,
        totalFiles: totalNumberOfFiles,
        uuid,
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
      action: 'docket_entries_batch_download_ready',
      caseFolder,
      index: batchIndex,
      totalNumberOfBatches,
      url,
      uuid,
    },
    userId: authorizedUser.userId,
  });
};
