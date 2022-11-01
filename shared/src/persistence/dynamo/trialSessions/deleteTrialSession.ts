import { remove } from '../../dynamodbClientService';

/**
 * deleteTrialSession
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {object} providers.trialSessionId the trial session id
 * @returns {Promise} the promise of the call to persistence
 */
export const deleteTrialSession = ({
  applicationContext,
  trialSessionId,
}: {
  applicationContext: IApplicationContext;
  trialSessionId: string;
}) =>
  remove({
    applicationContext,
    key: {
      pk: `trial-session|${trialSessionId}`,
      sk: `trial-session|${trialSessionId}`,
    },
  });
