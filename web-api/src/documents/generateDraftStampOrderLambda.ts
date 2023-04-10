const { genericHandler } = require('../genericHandler');

/**
 * used for generating a draft stamp order
 *
 * @param {object} event the AWS event object
 * @returns {Promise<*|undefined>} the api gateway response object containing the statusCode, body, and headers
 */
exports.generateDraftStampOrderLambda = event =>
  genericHandler(
    event,
    async ({ applicationContext }) => {
      await applicationContext
        .getUseCases()
        .generateDraftStampOrderInteractor(applicationContext, {
          ...event.pathParameters,
          ...JSON.parse(event.body),
        });
    },
    { logResults: false },
  );
