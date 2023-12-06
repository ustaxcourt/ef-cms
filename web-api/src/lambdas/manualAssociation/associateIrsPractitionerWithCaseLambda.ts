import { genericHandler } from '../../genericHandler';

/**
 * associate irsPractitioner with case
 *
 * @param {object} event the AWS event object
 * @returns {Promise<*|undefined>} the api gateway response object containing the statusCode, body, and headers
 */
export const associateIrsPractitionerWithCaseLambda = event =>
  genericHandler(event, async ({ applicationContext }) => {
    return await applicationContext
      .getUseCases()
      .associateIrsPractitionerWithCaseInteractor(applicationContext, {
        ...JSON.parse(event.body),
      });
  });
