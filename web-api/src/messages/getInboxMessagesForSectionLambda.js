const { genericHandler } = require('../genericHandler');

/**
 * gets the inbox messages for the section
 *
 * @param {object} event the AWS event object
 * @returns {Promise<*|undefined>} the api gateway response object containing the statusCode, body, and headers
 */
exports.getInboxMessagesForSectionLambda = event =>
  genericHandler(event, async ({ applicationContext }) => {
    return await applicationContext
      .getUseCases()
      .getInboxMessagesForSectionInteractor({
        applicationContext,
        section: event.pathParameters.section,
      });
  });
