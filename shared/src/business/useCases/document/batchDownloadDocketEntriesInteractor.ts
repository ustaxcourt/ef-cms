import { Case } from '../../entities/cases/Case';
import { NotFoundError } from '../../../../../web-api/src/errors/errors';
import {
  ROLE_PERMISSIONS,
  isAuthorized,
} from '../../../authorization/authorizationClientService';
import { UnauthorizedError } from '@web-api/errors/errors';
import { generateValidDocketEntryFilename } from '@shared/business/useCases/trialSessions/batchDownloadTrialSessionInteractor';

export type DownloadDocketEntryRequestType = {
  documentsSelectedForDownload?: string;
  clientConnectionId: string;
  docketNumber: string;
  printableDocketRecordFileId?: string;
};

const isSelectableForDownload = entry => {
  return !entry.isMinuteEntry && entry.isFileAttached && entry.isOnDocketRecord;
};

export const ALL_DOCUMENTS_SELECTED = 'all documents selected';

export const batchDownloadDocketEntriesInteractor = async (
  applicationContext: IApplicationContext,
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

  const { caseCaption, docketEntries, isSealed: isCaseSealed } = caseToBatch;
  const caseTitle = Case.getCaseTitle(caseCaption);
  const caseFolder = `${docketNumber}, ${caseTitle}`;
  const zipName = `${caseFolder}.zip`;

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

  const caseEntity = new Case(caseToBatch, { applicationContext });
  const documentToProcess = caseEntity.getDocketEntryById({
    docketEntryId: documentsSelectedForDownload,
  });

  const documentsToProcess =
    documentsSelectedForDownload === ALL_DOCUMENTS_SELECTED
      ? docketEntries
      : [documentToProcess];

  documentsToProcess
    .filter(entry => isSelectableForDownload(entry))
    .forEach(docInfo => {
      const { docketEntryId, documentTitle, filingDate, index } = docInfo;
      const filename = generateValidDocketEntryFilename({
        documentTitle,
        filingDate,
        index,
      });

      const fileDirectory =
        isCaseSealed || docInfo.isSealed ? `${caseFolder}/sealed` : caseFolder;

      const pdfTitle =
        docInfo.isStricken === 'true' ? `STRICKEN_${filename}` : filename;

      s3Ids.push(docketEntryId);
      fileNames.push(`${fileDirectory}/${pdfTitle}`);
    });

  const onEntry = entryData => {
    applicationContext.getNotificationGateway().sendNotificationToUser({
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
        numberOfFilesToBatch: s3Ids.length + extraFiles.length,
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
    message: {
      action: 'batch_download_ready',
      url,
    },
    userId: user.userId,
  });
};
