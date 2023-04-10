const { genericHandler } = require('../genericHandler');

/**
 * used for fetching existence of a single case
 *
 * @param {object} event the AWS event object
 * @returns {Promise<*|undefined>} the api gateway response object containing the statusCode, body, and headers
 */
exports.getCaseExistsLambda = event =>
  genericHandler(event, ({ applicationContext }) =>
    applicationContext
      .getUseCases()
      .getCaseExistsInteractor(applicationContext, {
        docketNumber: event.pathParameters.docketNumber,
      }),
  );
