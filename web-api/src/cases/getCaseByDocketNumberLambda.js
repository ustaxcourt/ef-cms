const { genericHandler } = require('../genericHandler');

/**
 * used for fetching a single case by docket number
 *
 * @param {object} event the AWS event object
 * @returns {Promise<*|undefined>} the api gateway response object containing the statusCode, body, and headers
 */
exports.getCaseByDocketNumberLambda = event =>
  genericHandler(event, async ({ applicationContext }) => {
    return await applicationContext
      .getUseCases()
      .getCaseByDocketNumberInteractor({
        applicationContext,
        docketNumber: event.pathParameters.docketNumber,
      });
  });
