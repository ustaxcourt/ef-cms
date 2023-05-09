import { genericHandler } from '../genericHandler';

/**
 * retrieves closed cases associated with the specified judge
 * @param {object} event the AWS event object
 * @returns {Promise<*|undefined>} the api gateway response object containing the statusCode, body, and headers
 */
export const getSubmittedAndCavCasesByJudgeLambda = event =>
  genericHandler(
    event,
    async ({ applicationContext }) => {
      return await applicationContext
        .getUseCases()
        .getSubmittedAndCavCasesByJudgeInteractor(applicationContext, {
          ...JSON.parse(event.body),
        });
    },
    { logResults: false },
  );
