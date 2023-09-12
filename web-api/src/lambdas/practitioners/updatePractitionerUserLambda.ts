import { genericHandler } from '../../genericHandler';

/**
 * updates a privatePractitioner or irsPractitioner user
 *
 * @param {object} event the AWS event object
 * @returns {Promise<*|undefined>} the api gateway response object containing the statusCode, body, and headers
 */
export const updatePractitionerUserLambda = event =>
  genericHandler(event, async ({ applicationContext }) => {
    const { bypassDocketEntry = false, user } = JSON.parse(event.body);

    return await applicationContext
      .getUseCases()
      .updatePractitionerUserInteractor(applicationContext, {
        barNumber: event.pathParameters.barNumber,
        bypassDocketEntry: bypassDocketEntry || false,
        user,
      });
  });
