import { updateConsistent } from '../../../dynamodbClientService';
import promiseRetry from 'promise-retry';

/**
 * setTrialSessionProcessingStatus
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {object} providers.trialSessionId the trial session id
 * @param {object} providers.trialSessionStatus the status of trial session processing
 * @returns {Promise} the promise of the call to persistence
 */
export const createChangeOfAddressJob = ({
  applicationContext,
  docketNumbers,
  jobId,
}: {
  applicationContext: IApplicationContext;
  jobId: string;
  docketNumbers: string[];
}) =>
  promiseRetry(retry =>
    updateConsistent({
      ExpressionAttributeNames: {
        '#allCases': 'allCases',
        '#jobId': 'jobId',
        '#processed': 'processed',
        '#remaining': 'remaining',
      },
      ExpressionAttributeValues: {
        ':jobId': jobId,
        ':processed': [],
        ':remaining': docketNumbers.length,
        ':value': docketNumbers,
      },
      Key: {
        pk: `change-of-address-job|${jobId}`,
        sk: `change-of-address-job|${jobId}`,
      },
      ReturnValues: 'UPDATED_NEW',
      UpdateExpression:
        'SET #allCases = :value, #remaining = :remaining, #jobId = :jobId, #processed = :processed',
      applicationContext,
    }).catch(retry),
  );
