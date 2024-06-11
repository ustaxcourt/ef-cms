import { Case } from '../../../../../shared/src/business/entities/cases/Case';
import { NotFoundError } from '../../../errors/errors';
import {
  ROLE_PERMISSIONS,
  isAuthorized,
} from '../../../../../shared/src/authorization/authorizationClientService';
import { ServerApplicationContext } from '@web-api/applicationContext';
import { UnauthorizedError } from '@web-api/errors/errors';
import { generateValidDocketEntryFilename } from '@web-api/business/useCases/trialSessions/batchDownloadTrialSessionInteractor';

export type DownloadDocketEntryRequestType = {
  documentsSelectedForDownload: string[];
  clientConnectionId: string;
  docketNumber: string;
  printableDocketRecordFileId?: string;
};

const batchDownloadDocketEntriesHelper = async (
  applicationContext: ServerApplicationContext,
  {
    clientConnectionId,
    docketNumber,
    documentsSelectedForDownload,
    printableDocketRecordFileId,
  }: DownloadDocketEntryRequestType,
) => {
  const user = applicationContext.getCurrentUser();

  if (!isAuthorized(user, ROLE_PERMISSIONS.BATCH_DOWNLOAD_CASE_DOCUMENTS)) {
    throw new UnauthorizedError('Unauthorized');
  }

  const caseToBatch = await applicationContext
    .getPersistenceGateway()
    .getCaseByDocketNumber({
      applicationContext,
      docketNumber,
    });

  if (!caseToBatch) {
    throw new NotFoundError(`Case: ${docketNumber} was not found.`);
  }

  const s3Ids: string[] = [];
  const fileNames: string[] = [];
  const extraFileNames: string[] = [];
  const extraFiles: string[] = [];

  const { caseCaption, isSealed: isCaseSealed } = caseToBatch;
  const caseTitle = Case.getCaseTitle(caseCaption);
  const caseFolder = `${docketNumber}, ${caseTitle}`;
  const zipName = `${caseFolder}.zip`;

  const caseEntity = new Case(caseToBatch, { applicationContext });

  const documentsToProcess = documentsSelectedForDownload.map(docketEntryId =>
    caseEntity.getDocketEntryById({
      docketEntryId,
    }),
  );

  documentsToProcess.forEach(docInfo => {
    const { docketEntryId, documentTitle, filingDate, index } = docInfo;
    const filename = generateValidDocketEntryFilename({
      documentTitle,
      filingDate,
      index,
    });

    const fileDirectory =
      isCaseSealed || docInfo.isSealed ? `${caseFolder}/sealed` : caseFolder;

    const pdfTitle = docInfo.isStricken ? `STRICKEN_${filename}` : filename;

    s3Ids.push(docketEntryId);
    fileNames.push(`${fileDirectory}/${pdfTitle}`);
  });

  if (printableDocketRecordFileId) {
    const pdfTitle = `${caseFolder}/${'0_Docket_Record.pdf'}`;

    const printableDocketRecordPdf: any = await applicationContext
      .getPersistenceGateway()
      .getDocument({
        applicationContext,
        key: printableDocketRecordFileId,
        useTempBucket: true,
      });
    extraFiles.push(printableDocketRecordPdf);
    extraFileNames.push(pdfTitle);
  }

  const onEntry = async entryData => {
    await applicationContext.getNotificationGateway().sendNotificationToUser({
      applicationContext,
      clientConnectionId,
      message: {
        action: 'batch_download_entry',
        ...entryData,
        numberOfDocketRecordsToGenerate: 0,
        numberOfFilesToBatch: s3Ids.length + extraFiles.length,
      },
      userId: user.userId,
    });
  };

  const onError = async error => {
    applicationContext.logger.error('Archive Error', { error });
    await applicationContext.getNotificationGateway().sendNotificationToUser({
      applicationContext,
      clientConnectionId,
      message: {
        action: 'batch_download_error',
        error,
      },
      userId: user.userId,
    });
  };

  const onProgress = async progressData => {
    await applicationContext.getNotificationGateway().sendNotificationToUser({
      applicationContext,
      clientConnectionId,
      message: {
        action: 'batch_download_progress',
        ...progressData,
        numberOfDocketRecordsToGenerate: 0,
        numberOfFilesToBatch: s3Ids.length + extraFiles.length,
      },
      userId: user.userId,
    });
  };

  const onUploadStart = async () => {
    await applicationContext.getNotificationGateway().sendNotificationToUser({
      applicationContext,
      clientConnectionId,
      message: {
        action: 'batch_download_upload_start',
        numberOfDocketRecordsToGenerate: 0,
        numberOfFilesToBatch: s3Ids.length + extraFiles.length,
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
    clientConnectionId,
    message: {
      action: 'batch_download_ready',
      url,
    },
    userId: user.userId,
  });
};

export const batchDownloadDocketEntriesInteractor = async (
  applicationContext: ServerApplicationContext,
  downloadDocketEntryRequestInfo: DownloadDocketEntryRequestType,
) => {
  try {
    await batchDownloadDocketEntriesHelper(
      applicationContext,
      downloadDocketEntryRequestInfo,
    );
  } catch (error) {
    const { userId } = applicationContext.getCurrentUser();
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
