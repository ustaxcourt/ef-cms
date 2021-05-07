const { genericHandler } = require('../genericHandler');

/**
 * lambda which is used for removing a petitioner from a case
 *
 * @param {object} event the AWS event object
 * @returns {Promise<*|undefined>} the api gateway response object containing the statusCode, body, and headers
 */
exports.removePetitionerAndUpdateCaptionLambda = event =>
  genericHandler(event, async ({ applicationContext }) => {
    return await applicationContext
      .getUseCases()
      .removePetitionerAndUpdateCaptionInteractor(applicationContext, {
        ...event.pathParameters,
        ...JSON.parse(event.body),
      });
  });
