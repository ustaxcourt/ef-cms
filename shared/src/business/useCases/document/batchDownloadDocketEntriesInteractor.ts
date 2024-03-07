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
};

export const batchDownloadDocketEntriesInteractor = async (
  applicationContext: IApplicationContext,
  requestParams: DownloadDocketEntryRequestType,
) => {
  const user = applicationContext.getCurrentUser();
  console.log('requestParams in BE', requestParams);
  if (!isAuthorized(user, ROLE_PERMISSIONS.GET_CASE)) {
    throw new UnauthorizedError('Unauthorized');
  }

  let s3Ids: string[] = [];
  let fileNames: string[] = [];

  const zipName = 'case-documents.zip';
  const { caseCaption, clientConnectionId, docketEntries, docketNumber } =
    requestParams;

  try {
    await Promise.all(
      docketEntries.map(docEntry => {
        const docId = docEntry.docketEntryId;
        const filename = generateValidDocketEntryFilename(docEntry); // move to utility function
        const caseTitle = Case.getCaseTitle(caseCaption);
        const caseFolder = `${docketNumber}, ${caseTitle}`;
        const pdfTitle = `${caseFolder}/${filename}`;

        s3Ids.push(docId);
        fileNames.push(pdfTitle);
      }),
    );
  } catch (e) {
    applicationContext.logger.error('Error fetching documents', { error: e });
    console.error('ERROR FETCHING documents', e);
  }

  const numberOfFilesToBatch = s3Ids.length;

  const onEntry = entryData => {
    applicationContext.getNotificationGateway().sendNotificationToUser({
      applicationContext,
      clientConnectionId,
      message: {
        action: 'batch_download_entry',
        ...entryData,
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
    extraFileNames: [],
    extraFiles: [],
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
