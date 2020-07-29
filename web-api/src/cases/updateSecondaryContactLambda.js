const { genericHandler } = require('../genericHandler');

/**
 * used for updating a secondary contact on a case
 *
 * @param {object} event the AWS event object
 * @returns {Promise<*|undefined>} the api gateway response object containing the statusCode, body, and headers
 */
exports.updateSecondaryContactLambda = event =>
  genericHandler(event, async ({ applicationContext }) => {
    return await applicationContext
      .getUseCases()
      .updateSecondaryContactInteractor({
        applicationContext,
        ...JSON.parse(event.body),
      });
  });
