import { RawTrialSessionWorkingCopy } from '@shared/business/entities/trialSessions/TrialSessionWorkingCopy';
import { put } from '../requests';
import { ClientApplicationContext } from '@web-client/applicationContext';

export const updateTrialSessionWorkingCopyInteractor = (
  applicationContext: ClientApplicationContext,
  { trialSessionWorkingCopyToUpdate },
): Promise<RawTrialSessionWorkingCopy> => {
  return put({
    applicationContext,
    body: trialSessionWorkingCopyToUpdate,
    endpoint: `/trial-sessions/${trialSessionWorkingCopyToUpdate.trialSessionId}/working-copy`,
  });
};
