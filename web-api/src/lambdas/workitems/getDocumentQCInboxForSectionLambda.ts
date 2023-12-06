import { genericHandler } from '../../genericHandler';

/**
 * returns all sent work items in a particular section
 *
 * @param {object} event the AWS event object
 * @returns {Promise<*|undefined>} the api gateway response object containing the statusCode, body, and headers
 */
export const getDocumentQCInboxForSectionLambda = event =>
  genericHandler(event, async ({ applicationContext }) => {
    const { section } = event.pathParameters || {};

    return await applicationContext
      .getUseCases()
      .getDocumentQCInboxForSectionInteractor(applicationContext, {
        section,
        ...event.queryStringParameters,
      });
  });
