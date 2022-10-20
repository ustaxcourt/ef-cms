import { get } from '../../dynamodbClientService';

/**
 * getTrialSessionWorkingCopy
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {string} providers.trialSessionId the id of the trial session
 * @param {string} providers.userId the id of the user
 * @returns {Promise} the promise of the call to persistence
 */
export const getTrialSessionWorkingCopy = ({
  applicationContext,
  trialSessionId,
  userId,
}: {
  applicationContext: IApplicationContext;
  trialSessionId: string;
  userId: string;
}) =>
  get({
    Key: {
      pk: `trial-session-working-copy|${trialSessionId}`,
      sk: `user|${userId}`,
    },
    applicationContext,
  });
