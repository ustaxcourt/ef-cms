import { updateConsistent } from '../../dynamodbClientService';

/**
 * setTrialSessionProcessingStatus
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {object} providers.trialSessionId the trial session id
 * @param {object} providers.trialSessionStatus the status of trial session processing
 * @returns {Promise} the promise of the call to persistence
 */
export const setTrialSessionProcessingStatus = ({
  applicationContext,
  trialSessionId,
  trialSessionStatus,
}: {
  applicationContext: IApplicationContext;
  trialSessionId: string;
  trialSessionStatus: string;
}) =>
  updateConsistent({
    ExpressionAttributeNames: {
      '#status': 'status',
    },
    ExpressionAttributeValues: {
      ':value': trialSessionStatus,
    },
    Key: {
      pk: `trial-session-processing-job-${trialSessionId}`,
      sk: `trial-session-processing-job-${trialSessionId}`,
    },
    ReturnValues: 'UPDATED_NEW',
    UpdateExpression: 'SET #status = :value',
    applicationContext,
  });
