const { genericHandler } = require('../genericHandler');

/**
 * used for adding a stamped coversheet
 *
 * @param {object} event the AWS event object
 * @returns {Promise<*|undefined>} the api gateway response object containing the statusCode, body, and headers
 */
exports.generateStampedCoversheetLambda = event =>
  genericHandler(
    event,
    async ({ applicationContext }) => {
      await applicationContext
        .getUseCases()
        .addCoversheetInteractor(applicationContext, event.pathParameters);
    },
    { logResults: false },
  );
