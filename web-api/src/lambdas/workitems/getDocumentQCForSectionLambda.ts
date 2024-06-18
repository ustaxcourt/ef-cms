import { genericHandler } from '../../genericHandler';

/**
 * returns all sent work items in a particular section
 *
 * @param {object} event the AWS event object
 * @returns {Promise<*|undefined>} the api gateway response object containing the statusCode, body, and headers
 */
export const getDocumentQCForSectionLambda = event =>
  genericHandler(event, async ({ applicationContext }) => {
    const { box, section } = event.pathParameters || {};

    return await applicationContext
      .getUseCases()
      .getDocumentQCForSectionInteractor(applicationContext, {
        box,
        section,
        ...event.queryStringParameters,
      });
  });
