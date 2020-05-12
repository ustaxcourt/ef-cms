const { genericHandler } = require('../genericHandler');

/**
 * used for fetching opinions matching the given a keyword
 *
 * @param {object} event the AWS event object
 * @returns {Promise<*|undefined>} the api gateway response object containing the statusCode, body, and headers
 */
exports.opinionPublicSearchLambda = event =>
  genericHandler(
    event,
    async ({ applicationContext }) => {
      return await applicationContext
        .getUseCases()
        .opinionPublicSearchInteractor({
          applicationContext,
          ...event.queryStringParameters,
        });
    },
    {
      isPublicUser: true,
      user: {},
    },
  );
