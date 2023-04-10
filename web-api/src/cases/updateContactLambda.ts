const { genericHandler } = require('../genericHandler');

/**
 * used for updating a contact on a case
 *
 * @param {object} event the AWS event object
 * @returns {Promise<*|undefined>} the api gateway response object containing the statusCode, body, and headers
 */
exports.updateContactLambda = event =>
  genericHandler(event, async ({ applicationContext }) => {
    return await applicationContext
      .getUseCases()
      .updateContactInteractor(applicationContext, {
        ...JSON.parse(event.body),
      });
  });
