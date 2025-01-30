import { get } from '../requests';

export const getTrialSessionOpenCasesCountInteractor = (
  applicationContext,
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
