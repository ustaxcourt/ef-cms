import { get } from '../requests';
import { ClientApplicationContext } from '@web-client/applicationContext';

export const getTrialSessionOpenCasesCountInteractor = (
  applicationContext: ClientApplicationContext,
  { trialSessionId },
): Promise<{
  calendaredCaseEntitiesCount: number;
  casesThatShouldReceiveNoticesCount: number;
}> => {
  return get({
    applicationContext,
    endpoint: `/trial-sessions-open-cases-count/${trialSessionId}`,
  });
};
