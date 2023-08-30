import { updateConsistent } from '../../../dynamodbClientService';

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
  updateConsistent({
    ExpressionAttributeNames: {
      '#jobId': 'jobId',
      '#remaining': 'remaining',
      '#status': 'status',
    },
    ExpressionAttributeValues: {
      ':jobId': jobId,
      ':remaining': docketNumbers.length,
      ':value': docketNumbers,
    },
    Key: {
      pk: `change-of-address-job-${jobId}`,
      sk: `change-of-address-job-${jobId}`,
    },
    ReturnValues: 'UPDATED_NEW',
    UpdateExpression:
      'SET #allCases = :value AND SET #remaining = :remaining AND SET #jobId = :jobId',
    applicationContext,
  });
