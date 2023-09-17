import { genericHandler } from '../../genericHandler';

/**
 * lambda which is used for creating a new case
 *
 * @param {object} event the AWS event object
 * @returns {Promise<*|undefined>} the api gateway response object containing the statusCode, body, and headers
 */
export const createCaseFromPaperLambda = event =>
  genericHandler(event, async ({ applicationContext }) => {
    return await applicationContext
      .getUseCases()
      .createCaseFromPaperInteractor(applicationContext, {
        ...JSON.parse(event.body),
      });
  });
