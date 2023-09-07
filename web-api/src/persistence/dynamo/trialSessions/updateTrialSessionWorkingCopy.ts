import { RawTrialSessionWorkingCopy } from '@shared/business/entities/trialSessions/TrialSessionWorkingCopy';
import { put } from '../../dynamodbClientService';

/**
 * updateTrialSessionWorkingCopy
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {object} providers.trialSessionWorkingCopyToUpdate the trial session working copy data to update
 * @returns {Promise} the promise of the call to persistence
 */
export const updateTrialSessionWorkingCopy = ({
  applicationContext,
  trialSessionWorkingCopyToUpdate,
}: {
  applicationContext: IApplicationContext;
  trialSessionWorkingCopyToUpdate: RawTrialSessionWorkingCopy;
}): Promise<any> =>
  put({
    Item: {
      ...trialSessionWorkingCopyToUpdate,
      pk: `trial-session-working-copy|${trialSessionWorkingCopyToUpdate.trialSessionId}`,
      sk: `user|${trialSessionWorkingCopyToUpdate.userId}`,
    },
    applicationContext,
  });
