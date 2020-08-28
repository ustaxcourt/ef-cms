const { genericHandler } = require('../genericHandler');

/**
 * used for fetching the public list of judges
 *
 * @param {object} event the AWS event object
 * @returns {Promise<*|undefined>} the api gateway response object containing the statusCode, body, and headers
 */
exports.getPublicJudgesLambda = event => {
  return genericHandler(
    event,
    async ({ applicationContext }) => {
      return await applicationContext
        .getUseCases()
        .getJudgesForPublicSearchInteractor({
          applicationContext,
        });
    },
    {
      isPublicUser: true,
      user: {},
    },
  );
};
