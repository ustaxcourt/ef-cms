const { genericHandler } = require('../genericHandler');

/**
 * used for processing failed stream records
 *
 * @param {object} event the AWS event object
 * @returns {Promise<*|undefined>} the api gateway response object containing the statusCode, body, and headers
 */
exports.reprocessFailedRecordsLambda = event =>
  genericHandler(
    event,
    async ({ applicationContext }) => {
      return await applicationContext
        .getUseCases()
        .reprocessFailedRecordsInteractor({
          applicationContext,
        });
    },
    {
      logUser: false,
      user: {},
    },
  );
