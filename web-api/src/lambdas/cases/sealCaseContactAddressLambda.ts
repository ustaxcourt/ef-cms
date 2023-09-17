import { genericHandler } from '../../genericHandler';

/**
 * used for sealing an address on a case
 *
 * @param {object} event the AWS event object
 * @returns {Promise<*|undefined>} the api gateway response object containing the statusCode, body, and headers
 */
export const sealCaseContactAddressLambda = event =>
  genericHandler(event, async ({ applicationContext }) => {
    return await applicationContext
      .getUseCases()
      .sealCaseContactAddressInteractor(applicationContext, {
        ...event.pathParameters,
      });
  });
