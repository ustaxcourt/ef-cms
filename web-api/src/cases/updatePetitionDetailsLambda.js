const { genericHandler } = require('../genericHandler');

/**
 * used for updating a case's petition details information (IRS notice date, case type, case procedure,
 * requested place of trial, and petition fee information)
 *
 * @param {object} event the AWS event object
 * @returns {Promise<*|undefined>} the api gateway response object containing the statusCode, body, and headers
 */
exports.updatePetitionDetailsLambda = event =>
  genericHandler(event, async ({ applicationContext }) => {
    return await applicationContext
      .getUseCases()
      .updatePetitionDetailsInteractor({
        applicationContext,
        ...event.pathParameters,
        ...JSON.parse(event.body),
      });
  });
