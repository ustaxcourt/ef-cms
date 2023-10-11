import { genericHandler } from '../../genericHandler';

/**
 * gets all trial sessions for a judge
 *
 * @param {object} event the AWS event object
 * @returns {Promise<*|undefined>} the api gateway response object containing the statusCode, body, and headers
 */
export const getTrialSessionsForJudgeLambda = event =>
  genericHandler(event, async ({ applicationContext }) => {
    return await applicationContext
      .getUseCases()
      .getTrialSessionsForJudgeInteractor(
        applicationContext,
        event.pathParameters.judgeId,
      );
  });
