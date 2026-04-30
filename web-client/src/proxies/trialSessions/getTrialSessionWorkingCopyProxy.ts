import { RawTrialSessionWorkingCopy } from '@shared/business/entities/trialSessions/TrialSessionWorkingCopy';
import { get } from '../requests';
import { ClientApplicationContext } from '@web-client/applicationContext';

export const getTrialSessionWorkingCopyInteractor = (
  applicationContext: ClientApplicationContext,
  { trialSessionId },
): Promise<RawTrialSessionWorkingCopy> => {
  return get({
    applicationContext,
    endpoint: `/trial-sessions/${trialSessionId}/working-copy`,
  });
};
