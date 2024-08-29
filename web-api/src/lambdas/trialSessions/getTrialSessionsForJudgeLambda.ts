import { UnknownAuthUser } from '@shared/business/entities/authUser/AuthUser';
import { genericHandler } from '../../genericHandler';
import { getTrialSessionsForJudgeInteractor } from '@web-api/business/useCases/trialSessions/getTrialSessionsForJudgeInteractor';

/**
 * gets all trial sessions for a judge
 *
 * @param {object} event the AWS event object
 * @returns {Promise<*|undefined>} the api gateway response object containing the statusCode, body, and headers
 */
export const getTrialSessionsForJudgeLambda = (
  event,
  authorizedUser: UnknownAuthUser,
) =>
  genericHandler(event, async ({ applicationContext }) => {
    return await getTrialSessionsForJudgeInteractor(
      applicationContext,
      event.pathParameters.judgeId,
      authorizedUser,
    );
  });
