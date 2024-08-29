import { genericHandler } from '../../genericHandler';
import { getCaseExistsInteractor } from '@shared/business/useCases/getCaseExistsInteractor';

/**
 * used for fetching existence of a single case
 *
 * @param {object} event the AWS event object
 * @returns {Promise<*|undefined>} the api gateway response object containing the statusCode, body, and headers
 */
export const getCaseExistsLambda = event =>
  genericHandler(event, ({ applicationContext }) =>
    getCaseExistsInteractor(applicationContext, {
      docketNumber: event.pathParameters.docketNumber,
    }),
  );
