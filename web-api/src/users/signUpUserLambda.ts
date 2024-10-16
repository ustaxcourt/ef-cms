import { genericHandler } from '../genericHandler';
import { signUpUserInteractor } from '@web-api/business/useCases/auth/signUpUserInteractor';

/**
 * creates a new user locally
 * @param {object} event the AWS event object
 * @returns {Promise<*|undefined>} the local api gateway response object containing the statusCode, body, and headers
 */
export const signUpUserLambda = event =>
  genericHandler(event, async ({ applicationContext }) => {
    return await signUpUserInteractor(applicationContext, {
      user: JSON.parse(event.body),
    });
  });
