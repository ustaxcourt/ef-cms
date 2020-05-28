const { genericHandler } = require('../genericHandler');

/**
 * updates a statistic on the case
 *
 * @param {object} event the AWS event object
 * @returns {Promise<*|undefined>} the api gateway response object containing the statusCode, body, and headers
 */
exports.updateDeficiencyStatisticLambda = event =>
  genericHandler(event, async ({ applicationContext }) => {
    return await applicationContext
      .getUseCases()
      .updateDeficiencyStatisticInteractor({
        applicationContext,
        caseId: event.pathParameters.caseId,
        statisticIndex: event.pathParameters.statisticIndex,
        ...JSON.parse(event.body),
      });
  });
