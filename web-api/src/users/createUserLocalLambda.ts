import { genericHandler } from '../genericHandler';

/**
 * creates a new user locally
 * @param {object} event the AWS event object
 * @returns {Promise<*|undefined>} the local api gateway response object containing the statusCode, body, and headers
 */
exports.createUserLocalLambda = event =>
  genericHandler(event, async ({ applicationContext }) => {
    return await applicationContext
      .getUseCases()
      .createUserInteractorLocal(applicationContext, {
        user: JSON.parse(event.body),
      });
  });
