import { put } from '../requests';
import { ClientApplicationContext } from '@web-client/applicationContext';

export const updateTrialSessionWorkingCopyInteractor = (
  applicationContext: ClientApplicationContext,
  { trialSessionWorkingCopyToUpdate },
) => {
  return put({
    applicationContext,
    body: trialSessionWorkingCopyToUpdate,
    endpoint: `/trial-sessions/${trialSessionWorkingCopyToUpdate.trialSessionId}/working-copy`,
  });
};
