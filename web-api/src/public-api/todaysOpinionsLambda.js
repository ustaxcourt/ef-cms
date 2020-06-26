const { genericHandler } = require('../genericHandler');

/**
 * used for fetching opinions created for the current date
 *
 * @param {object} event the AWS event object
 * @returns {Promise<*|undefined>} the api gateway response object containing the statusCode, body, and headers
 */
exports.todaysOpinionsLambda = event =>
  genericHandler(
    event,
    async ({ applicationContext }) => {
      return await applicationContext
        .getUseCases()
        .getTodaysOpinionsInteractor({
          applicationContext,
        });
    },
    {
      isPublicUser: true,
      user: {},
    },
  );
