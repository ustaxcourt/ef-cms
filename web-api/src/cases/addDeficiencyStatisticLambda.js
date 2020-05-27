const { genericHandler } = require('../genericHandler');

/**
 * adds a statistic to the case
 *
 * @param {object} event the AWS event object
 * @returns {Promise<*|undefined>} the api gateway response object containing the statusCode, body, and headers
 */
exports.addDeficiencyStatisticLambda = event =>
  genericHandler(event, async ({ applicationContext }) => {
    return await applicationContext
      .getUseCases()
      .addDeficiencyStatisticInteractor({
        applicationContext,
        caseId: event.pathParameters.caseId,
        ...JSON.parse(event.body),
      });
  });
