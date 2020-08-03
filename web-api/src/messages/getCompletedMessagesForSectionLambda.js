const { genericHandler } = require('../genericHandler');

/**
 * gets the completed messages for the section
 *
 * @param {object} event the AWS event object
 * @returns {Promise<*|undefined>} the api gateway response object containing the statusCode, body, and headers
 */
exports.getCompletedMessagesForSectionLambda = event =>
  genericHandler(event, async ({ applicationContext }) => {
    return await applicationContext
      .getUseCases()
      .getCompletedMessagesForSectionInteractor({
        applicationContext,
        section: event.pathParameters.section,
      });
  });
