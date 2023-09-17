import { genericHandler } from '../../genericHandler';

/**
 * used for fetching the case inventory report data
 *
 * @param {object} event the AWS event object
 * @returns {Promise<*|undefined>} the api gateway response object containing the statusCode, body, and headers
 */
export const getCaseInventoryReportLambda = event =>
  genericHandler(event, async ({ applicationContext }) => {
    return await applicationContext
      .getUseCases()
      .getCaseInventoryReportInteractor(applicationContext, {
        ...event.queryStringParameters,
      });
  });
