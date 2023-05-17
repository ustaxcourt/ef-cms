import { genericHandler } from '../genericHandler';

/**
 * retrieves cases with specified status(es) associated with the specified judge
 * @param {object} event the AWS event object
 * @returns {Promise<*|undefined>} the api gateway response object containing the statusCode, body, and headers
 */
export const getCasesByStatusAndByJudgeLambda = event =>
  genericHandler(
    event,
    async ({ applicationContext }) => {
      return await applicationContext
        .getUseCases()
        .getCasesByStatusAndByJudgeInteractor(applicationContext, {
          ...JSON.parse(event.body),
        });
    },
    { logResults: false },
  );
