import { genericHandler } from '../../genericHandler';

/**
 * used for fetching a single case
 *
 * @param {object} event the AWS event object
 * @returns {Promise<*|undefined>} the api gateway response object containing the statusCode, body, and headers
 */
export const getPublicCaseLambda = event =>
  genericHandler(
    event,
    ({ applicationContext }) =>
      applicationContext
        .getUseCases()
        .getPublicCaseInteractor(applicationContext, {
          docketNumber: event.pathParameters.docketNumber,
        }),
    { user: {} },
  );
