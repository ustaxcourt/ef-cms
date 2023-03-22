const { genericHandler } = require('../genericHandler');

/**
 * used for fetching orders matching the given a keyword
 *
 * @param {object} event the AWS event object
 * @returns {Promise<*|undefined>} the api gateway response object containing the statusCode, body, and headers
 */
exports.orderPublicSearchLambda = event =>
  genericHandler(
    event,
    async ({ applicationContext }) => {
      return await applicationContext
        .getUseCases()
        .orderPublicSearchInteractor(applicationContext, {
          ...event.queryStringParameters,
        });
    },
    { user: {} },
  );
