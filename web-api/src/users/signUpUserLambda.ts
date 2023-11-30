import { genericHandler } from '../genericHandler';

/**
 * creates a new user locally
 * @param {object} event the AWS event object
 * @returns {Promise<*|undefined>} the local api gateway response object containing the statusCode, body, and headers
 */
export const createUserCognitoLambda = event =>
  genericHandler(event, async ({ applicationContext }) => {
    return await applicationContext
      .getUseCases()
      .createUserCognitoInteractor(applicationContext, {
        user: JSON.parse(event.body),
      });
  });
