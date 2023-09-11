import { genericHandler } from '../../genericHandler';

/**
 * used for sealing docket entries
 *
 * @param {object} event the AWS event object
 * @returns {Promise<*|undefined>} the api gateway response object containing the statusCode, body, and headers
 */
export const sealDocketEntryLambda = event =>
  genericHandler(event, async ({ applicationContext }) => {
    const {
      pathParameters: { docketEntryId, docketNumber },
    } = event;

    const { docketEntrySealedTo } = JSON.parse(event.body);

    return await applicationContext
      .getUseCases()
      .sealDocketEntryInteractor(applicationContext, {
        docketEntryId,
        docketEntrySealedTo,
        docketNumber,
      });
  });
