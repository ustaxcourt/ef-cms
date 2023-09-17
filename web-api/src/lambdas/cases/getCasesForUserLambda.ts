import { genericHandler } from '../../genericHandler';

/**
 * used for fetching all open and closed cases for a particular user
 *
 * @param {object} event the AWS event object
 * @returns {Promise<*|undefined>} the api gateway response object containing the statusCode, body, and headers
 */
export const getCasesForUserLambda = event =>
  genericHandler(event, async ({ applicationContext }) => {
    return await applicationContext
      .getUseCases()
      .getCasesForUserInteractor(applicationContext);
  });
