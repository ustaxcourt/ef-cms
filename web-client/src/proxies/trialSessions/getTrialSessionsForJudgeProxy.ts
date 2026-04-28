import { get } from '../requests';
import { ClientApplicationContext } from '@web-client/applicationContext';

export const getTrialSessionsForJudgeInteractor = (
  applicationContext: ClientApplicationContext,
  judgeId,
) => {
  return get({
    applicationContext,
    endpoint: `/judges/${judgeId}/trial-sessions?fields=trialLocation,trialSessionId,sessionStatus,startDate`,
  });
};
