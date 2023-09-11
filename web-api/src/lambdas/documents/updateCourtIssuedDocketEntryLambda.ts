import { genericHandler } from '../../genericHandler';

/**
 * lambda which is used for updating a court issued docket entry
 *
 * @param {object} event the AWS event object
 * @returns {Promise<*|undefined>} the api gateway response object containing the statusCode, body, and headers
 */
export const updateCourtIssuedDocketEntryLambda = event =>
  genericHandler(event, async ({ applicationContext }) => {
    return await applicationContext
      .getUseCases()
      .updateCourtIssuedDocketEntryInteractor(
        applicationContext,
        JSON.parse(event.body),
      );
  });
