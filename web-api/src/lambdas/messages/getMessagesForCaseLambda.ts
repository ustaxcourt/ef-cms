import { genericHandler } from '../../genericHandler';

/**
 * lambda which is used for retrieving messages for a case
 *
 * @param {object} event the AWS event object
 * @returns {Promise<*|undefined>} the api gateway response object containing the statusCode, body, and headers
 */
export const getMessagesForCaseLambda = event =>
  genericHandler(event, async ({ applicationContext }) => {
    return await applicationContext
      .getUseCases()
      .getMessagesForCaseInteractor(applicationContext, {
        ...event.pathParameters,
      });
  });
