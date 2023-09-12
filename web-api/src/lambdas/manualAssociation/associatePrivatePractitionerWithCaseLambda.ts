import { genericHandler } from '../../genericHandler';

/**
 * associate practitioner with case
 *
 * @param {object} event the AWS event object
 * @returns {Promise<*|undefined>} the api gateway response object containing the statusCode, body, and headers
 */
export const associatePrivatePractitionerWithCaseLambda = event =>
  genericHandler(event, async ({ applicationContext }) => {
    return await applicationContext
      .getUseCases()
      .associatePrivatePractitionerWithCaseInteractor(applicationContext, {
        ...JSON.parse(event.body),
      });
  });
