import { NotFoundError } from '../../../../../web-api/src/errors/errors';
import {
  ROLE_PERMISSIONS,
  isAuthorized,
} from '../../../authorization/authorizationClientService';
import { TRIAL_SESSION_SCOPE_TYPES } from '../../entities/EntityConstants';
import { TrialSession } from '../../entities/trialSessions/TrialSession';
import { UnauthorizedError } from '@web-api/errors/errors';
import { isEmpty, isEqual } from 'lodash';

/**
 * batchDownloadDocketEntriesInteractor
 *
 * @param {object} applicationContext the application context
 * @param {string} providers.trialSessionId the id of the trial session to be closed
 * @returns {Promise} the promise of the updateTrialSession call
 */
export const batchDownloadDocketEntriesInteractor = async (
  applicationContext: IApplicationContext,
  { documentIds }: { documentIds: string[] },
) => {
  const user = applicationContext.getCurrentUser();
  console.log('documentIds in BE', documentIds);
  if (!isAuthorized(user, ROLE_PERMISSIONS.GET_CASE)) {
    throw new UnauthorizedError('Unauthorized');
  }

  try {
    const documentPdfsFromS3 = await Promise.all(
      documentIds.map(docId => {
        console.log('docId', docId);
        return applicationContext.getPersistenceGateway().getDocument({
          applicationContext,
          key: docId,
          useTempBucket: false,
        });
      }),
    );

    console.log('documentPdfsFromS3', documentPdfsFromS3);
  } catch (e) {
    console.error('ERROR FETCHING IDS', e);
  }

  // fetch all the documents in s3 (applicationContext.getPersistenceGateway().getDocument)
  // process these docs
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
