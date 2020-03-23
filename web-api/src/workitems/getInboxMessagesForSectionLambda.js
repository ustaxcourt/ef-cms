const { genericHandler } = require('../genericHandler');

/**
 * returns all sent work items in a particular section
 *
 * @param {object} event the AWS event object
 * @returns {Promise<*|undefined>} the api gateway response object containing the statusCode, body, and headers
 */
exports.getInboxMessagesForSectionLambda = event =>
  genericHandler(event, async ({ applicationContext }) => {
    const { section } = event.pathParameters || {};

    return await applicationContext
      .getUseCases()
      .getInboxMessagesForSectionInteractor({
        applicationContext,
        section,
      });
  });
