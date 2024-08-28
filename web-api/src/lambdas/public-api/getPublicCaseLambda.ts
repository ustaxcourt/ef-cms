import { genericHandler } from '../../genericHandler';
import { getPublicCaseInteractor } from '@web-api/business/useCases/public/getPublicCaseInteractor';

/**
 * used for fetching a single case
 *
 * @param {object} event the AWS event object
 * @returns {Promise<*|undefined>} the api gateway response object containing the statusCode, body, and headers
 */
export const getPublicCaseLambda = event =>
  genericHandler(event, ({ applicationContext }) =>
    getPublicCaseInteractor(applicationContext, {
      docketNumber: event.pathParameters.docketNumber,
    }),
  );
