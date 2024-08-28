import { genericHandler } from '../../genericHandler';
import { validatePdfInteractor } from '@web-api/business/useCases/pdf/validatePdfInteractor';

/**
 * used for validating PDF documents
 *
 * @param {object} event the AWS event object
 * @returns {Promise<*|undefined>} the api gateway response object containing the statusCode, body, and headers
 */
export const validatePdfLambda = event =>
  genericHandler(event, async ({ applicationContext }) => {
    const { key } = event.pathParameters || {};

    return await validatePdfInteractor(applicationContext, {
      key,
    });
  });
