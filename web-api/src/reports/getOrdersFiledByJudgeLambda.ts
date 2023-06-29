import { genericHandler } from '../genericHandler';

/**
 * gets all orders filed by judge for their activity report
 * @param {object} event the AWS event object
 * @returns {Promise<*|undefined>} the api gateway response object containing the statusCode, body, and headers
 */
export const getOrdersFiledByJudgeLambda = event =>
  genericHandler(
    event,
    async ({ applicationContext }) => {
      return await applicationContext
        .getUseCases()
        .getOrdersFiledByJudgeInteractor(applicationContext, {
          ...JSON.parse(event.body),
        });
    },
    { logResults: false },
  );
