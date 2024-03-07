import { Case, isClosed } from '../../entities/cases/Case';
import { NotFoundError } from '../../../../../web-api/src/errors/errors';
import {
  ROLE_PERMISSIONS,
  isAuthorized,
} from '../../../authorization/authorizationClientService';
import { TRIAL_SESSION_SCOPE_TYPES } from '../../entities/EntityConstants';
import { TrialSession } from '../../entities/trialSessions/TrialSession';
import { UnauthorizedError } from '@web-api/errors/errors';
import { isEmpty, isEqual } from 'lodash';

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

  const { docketEntries } = requestParams;

  let extraFiles: any = [];
  let extraFileNames: string[] = [];
  let s3Ids: string[] = [];

  // things to bring into the BE
  // 1. Case - caseCaption, docketNumber (caseTitle)
  // 2. Docket Entry
  //    - isOnDocketRecord, isFileAttached, docketEntryId (documentId), filingDate, index, documentTitle
  //    - use `getDocketEntryOnCase` to get docket entry and get the appropriate meta data

  try {
    docketEntries.forEach(async docEntry => {
      const docId = docEntry.docketEntryId;
      console.log('docId', docEntry.docketEntryId);

      const doc = await applicationContext.getPersistenceGateway().getDocument({
        applicationContext,
        key: docId,
        useTempBucket: false,
      });

      console.log('doc', doc);

      s3Ids.push(docId);
      extraFiles.push(doc);
      extraFileNames.push(`${docId}/0_Docket Record.pdf`);
    });
  } catch (e) {
    applicationContext.logger.error('Error fetching documents', { error: e });
    console.error('ERROR FETCHING documents', e);
  }

  // try {
  //   await applicationContext.getPersistenceGateway().zipDocuments({
  //     applicationContext,
  //     extraFileNames,
  //     extraFiles,
  //     fileNames,
  //     onEntry,
  //     onError,
  //     onProgress,
  //     onUploadStart,
  //     s3Ids,
  //     zipName: 'case-documents.zip',
  //   });
  // } catch (error) {
  //   applicationContext.logger.error('Error zipping documents', {
  //     error,
  //   });
  // }

  // fetch all the documents in s3 (applicationContext.getPersistenceGateway().getDocument)
  // process some data about these docs
  //    generae file names for each document
  //    generae pdf titles for each document
  //    set s3ids (docket entry id) for batching
  // send websocket message that processing has started
  //    send batch name
  //    send case number
  //    send number of files batches
  // send request to zip files (applicationContext.getPersistenceGateway().zipDocuments)
  //     applicationContext,
  //     fileNames,
  //     onEntry,
  //     onError,
  //     onProgress,
  //     onUploadStart,
  //     s3Ids,
  //     zipName,
  // create new pdf url for zipped files
  // send final websocket notification to FE
};
