const { genericHandler } = require('../genericHandler');

/**
 * used for processing stream records from persistence
 *
 * @param {object} event the AWS event object
 * @returns {Promise<*|undefined>} the api gateway response object containing the statusCode, body, and headers
 */
exports.processStreamRecordsLambda = event =>
  genericHandler(
    event,
    async ({ applicationContext }) => {
      const recordsToProcess = event.Records;

      return await applicationContext
        .getUseCases()
        .processStreamRecordsInteractor({
          applicationContext,
          recordsToProcess,
        });
    },
    {
      logUser: false,
      user: {},
    },
  );
