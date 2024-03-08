import { Case } from '../../entities/cases/Case';
// import { NotFoundError } from '../../../../../web-api/src/errors/errors';
import {
  ROLE_PERMISSIONS,
  isAuthorized,
} from '../../../authorization/authorizationClientService';
import { UnauthorizedError } from '@web-api/errors/errors';
import { generateValidDocketEntryFilename } from '@shared/business/useCases/trialSessions/batchDownloadTrialSessionInteractor';

export type DocumentsToDownloadInfoType = {
  isOnDocketRecord: boolean;
  isFileAttached?: boolean;
  filingDate: string;
  docketEntryId: string;
  index?: number;
  documentTitle: string;
};

export type DownloadDocketEntryRequestType = {
  caseCaption: string;
  docketNumber: string;
  docketEntries: DocumentsToDownloadInfoType[];
  clientConnectionId: string;
  printableDocketRecordFileId?: string;
};

export const batchDownloadDocketEntriesInteractor = async (
  applicationContext: IApplicationContext,
  requestParams: DownloadDocketEntryRequestType,
) => {
  const user = applicationContext.getCurrentUser();
  if (!isAuthorized(user, ROLE_PERMISSIONS.GET_CASE)) {
    throw new UnauthorizedError('Unauthorized');
  }

  const {
    caseCaption,
    clientConnectionId,
    docketEntries,
    docketNumber,
    printableDocketRecordFileId,
  } = requestParams;

  const s3Ids: string[] = [];
  const fileNames: string[] = [];
  const extraFileNames: string[] = [];
  const extraFiles: string[] = [];
  const numberOfFilesToBatch = s3Ids.length;
  const caseTitle = Case.getCaseTitle(caseCaption);
  const caseFolder = `${docketNumber}, ${caseTitle}`;

  const zipName = `${caseFolder}.zip`;

  if (printableDocketRecordFileId) {
    const pdfTitle = `${caseFolder}/${'printableDocketRecordname.pdf'}`;

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

  docketEntries.forEach(docEntry => {
    const { docketEntryId, documentTitle, filingDate, index } = docEntry;
    const filename = generateValidDocketEntryFilename({
      documentTitle,
      filingDate,
      index,
    });

    const pdfTitle = `${caseFolder}/${filename}`;

    s3Ids.push(docketEntryId);
    fileNames.push(pdfTitle);
  });

  const onEntry = entryData => {
    applicationContext.getNotificationGateway().sendNotificationToUser({
      applicationContext,
      clientConnectionId,
      message: {
        action: 'batch_download_entry',
        ...entryData,
        numberOfDocketRecordsToGenerate: 0,
        numberOfFilesToBatch,
      },
      userId: user.userId,
    });
  };

  const onError = error => {
    applicationContext.logger.error('Archive Error', { error });
    applicationContext.getNotificationGateway().sendNotificationToUser({
      applicationContext,
      clientConnectionId,
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
      clientConnectionId,
      message: {
        action: 'batch_download_progress',
        ...progressData,
        numberOfDocketRecordsToGenerate: 0,
        numberOfFilesToBatch,
      },
      userId: user.userId,
    });
  };

  const onUploadStart = () => {
    applicationContext.getNotificationGateway().sendNotificationToUser({
      applicationContext,
      clientConnectionId,
      message: {
        action: 'batch_download_upload_start',
        numberOfDocketRecordsToGenerate: 0,
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
