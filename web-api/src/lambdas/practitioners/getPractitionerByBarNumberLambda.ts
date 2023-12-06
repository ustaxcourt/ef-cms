import { genericHandler } from '../../genericHandler';

/**
 * gets practitioner user by bar number
 *
 * @param {object} event the AWS event object
 * @returns {Promise<*|undefined>} the api gateway response object containing the statusCode, body, and headers
 */
export const getPractitionerByBarNumberLambda = event =>
  genericHandler(event, async ({ applicationContext }) => {
    return await applicationContext
      .getUseCases()
      .getPractitionerByBarNumberInteractor(applicationContext, {
        barNumber: event.pathParameters.barNumber,
      });
  });
