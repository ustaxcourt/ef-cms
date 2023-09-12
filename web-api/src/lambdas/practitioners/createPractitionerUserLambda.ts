import { genericHandler } from '../../genericHandler';

/**
 * creates a privatePractitioner or irsPractitioner user
 *
 * @param {object} event the AWS event object
 * @returns {Promise<*|undefined>} the api gateway response object containing the statusCode, body, and headers
 */
export const createPractitionerUserLambda = event =>
  genericHandler(event, async ({ applicationContext }) => {
    return await applicationContext
      .getUseCases()
      .createPractitionerUserInteractor(applicationContext, {
        user: JSON.parse(event.body).user,
      });
  });
