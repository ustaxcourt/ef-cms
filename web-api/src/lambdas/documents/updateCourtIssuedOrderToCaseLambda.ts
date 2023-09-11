import { genericHandler } from '../../genericHandler';

/**
 * lambda which is used for updating a draft order
 *
 * @param {object} event the AWS event object
 * @returns {Promise<*|undefined>} the api gateway response object containing the statusCode, body, and headers
 */
export const updateCourtIssuedOrderToCaseLambda = event =>
  genericHandler(event, async ({ applicationContext }) => {
    return await applicationContext
      .getUseCases()
      .updateCourtIssuedOrderInteractor(applicationContext, {
        ...JSON.parse(event.body),
        docketEntryIdToEdit: event.pathParameters.docketEntryId,
      });
  });
