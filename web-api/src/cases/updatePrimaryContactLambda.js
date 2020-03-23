const { genericHandler } = require('../genericHandler');

/**
 * used for updating a primary contact on a case
 *
 * @param {object} event the AWS event object
 * @returns {Promise<*|undefined>} the api gateway response object containing the statusCode, body, and headers
 */
exports.updatePrimaryContactLambda = event =>
  genericHandler(event, async ({ applicationContext }) => {
    const { caseId, contactInfo } = JSON.parse(event.body);

    return await applicationContext
      .getUseCases()
      .updatePrimaryContactInteractor({
        applicationContext,
        caseId,
        contactInfo,
      });
  });
