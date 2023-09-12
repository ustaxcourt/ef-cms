import { genericHandler } from '../../genericHandler';

/**
 * sets the given message's read status
 *
 * @param {object} event the AWS event object
 * @returns {Promise<*|undefined>} the api gateway response object containing the statusCode, body, and headers
 */
export const setMessageAsReadLambda = event =>
  genericHandler(event, async ({ applicationContext }) => {
    const { messageId } = event.pathParameters || {};

    return await applicationContext
      .getUseCases()
      .setMessageAsReadInteractor(applicationContext, {
        messageId,
        ...JSON.parse(event.body),
      });
  });
