const { genericHandler } = require('../genericHandler');

/**
 * used for fetching opinions matching the provided search string
 *
 * @param {object} event the AWS event object
 * @returns {Promise<*|undefined>} the api gateway response object containing the statusCode, body, and headers
 */
exports.opinionAdvancedSearchLambda = event =>
  genericHandler(event, async ({ applicationContext }) => {
    return await applicationContext
      .getUseCases()
      .opinionAdvancedSearchInteractor({
        applicationContext,
        ...event.queryStringParameters,
      });
  });
