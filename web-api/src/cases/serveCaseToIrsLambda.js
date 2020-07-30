const { genericHandler } = require('../genericHandler');

/**
 * serve case to irs
 *
 * @param {object} event the AWS event object
 * @returns {Promise<*|undefined>} the api gateway response object containing the statusCode, body, and headers
 */
exports.serveCaseToIrsLambda = event =>
  genericHandler(
    event,
    async ({ applicationContext }) => {
      return await applicationContext.getUseCases().serveCaseToIrsInteractor({
        ...event.pathParameters,
        applicationContext,
      });
    },
    { logResults: false },
  );
