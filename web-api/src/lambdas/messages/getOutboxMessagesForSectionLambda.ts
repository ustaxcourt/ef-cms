import { genericHandler } from '../../genericHandler';

/**
 * gets the outbox messages for the section
 *
 * @param {object} event the AWS event object
 * @returns {Promise<*|undefined>} the api gateway response object containing the statusCode, body, and headers
 */
export const getOutboxMessagesForSectionLambda = event =>
  genericHandler(event, async ({ applicationContext }) => {
    return await applicationContext
      .getUseCases()
      .getOutboxMessagesForSectionInteractor(applicationContext, {
        section: event.pathParameters.section,
      });
  });
