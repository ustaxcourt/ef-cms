import { get } from '../requests';

/**
 * getTrialSessionsForJudgeInteractor
 *
 * @param {object} applicationContext the application context
 * @returns {Promise<*>} the promise of the api call
 */
export const getTrialSessionsForJudgeInteractor = (
  applicationContext,
  judgeId,
) => {
  return get({
    applicationContext,
    endpoint: `/judges/${judgeId}/trial-sessions?fields=trialLocation,trialSessionId,sessionStatus,startDate`,
  });
};
