import { genericHandler } from '../../genericHandler';

/**
 * used for determining if a user has pending association with a case or not
 *
 * @param {object} event the AWS event object
 * @returns {Promise<*|undefined>} the api gateway response object containing the statusCode, body, and headers
 */
export const verifyPendingCaseForUserLambda = event =>
  genericHandler(event, async ({ applicationContext }) => {
    return await applicationContext
      .getUseCases()
      .verifyPendingCaseForUserInteractor(applicationContext, {
        ...event.pathParameters,
      });
  });
