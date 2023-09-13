import { genericHandler } from '../../genericHandler';

/**
 * lambda which is used for updating a docket entry's meta for a case
 *
 * @param {object} event the AWS event object
 * @returns {Promise<*|undefined>} the api gateway response object containing the statusCode, body, and headers
 */
export const updateDocketEntryMetaLambda = event =>
  genericHandler(event, async ({ applicationContext }) => {
    return await applicationContext
      .getUseCases()
      .updateDocketEntryMetaInteractor(applicationContext, {
        ...JSON.parse(event.body),
        ...event.pathParameters,
      });
  });
