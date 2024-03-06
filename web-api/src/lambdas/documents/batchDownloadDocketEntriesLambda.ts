import { genericHandler } from '../../genericHandler';

/**
 * batch download docket entries
 *
 * @param {object} event the AWS event object
 * @returns {Promise<*|undefined>} the api gateway response object containing the statusCode, body, and headers
 */
export const batchDownloadDocketEntriesLambda = event =>
  genericHandler(event, async ({ applicationContext }) => {
    const { documentIds } = event.queryStringParameters;
    await applicationContext
      .getUseCases()
      .batchDownloadDocketEntriesInteractor(applicationContext, {
        documentIds,
      });
  });
