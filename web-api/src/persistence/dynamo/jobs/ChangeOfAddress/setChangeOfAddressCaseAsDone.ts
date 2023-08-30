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
export const setChangeOfAddressCaseAsDone = ({
  applicationContext,
  docketNumber,
  jobId,
}: {
  applicationContext: IApplicationContext;
  jobId: string;
  docketNumber: string;
}) =>
  updateConsistent({
    ExpressionAttributeNames: {
      '#decrementValue': 'decrementValue',
      '#processed': 'processed',
      '#remaining': 'remaining',
      '#status': 'status',
    },
    ExpressionAttributeValues: {
      ':decrementValue': -1,
      ':value': docketNumber,
    },
    Key: {
      pk: `change-of-address-job-${jobId}`,
      sk: `change-of-address-job-${jobId}`,
    },
    ReturnValues: 'UPDATED_NEW',
    UpdateExpression:
      'SET #processed = list_append(#processed, :value) ADD #remaining #decrementValue',
    applicationContext,
  });
