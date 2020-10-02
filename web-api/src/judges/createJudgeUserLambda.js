const { genericHandler } = require('../genericHandler');

/**
 * creates a judge user
 *
 * @param {object} event the AWS event object
 * @returns {Promise<*|undefined>} the api gateway response object containing the statusCode, body, and headers
 */
exports.createJudgeUserLambda = event =>
  genericHandler(event, async ({ applicationContext }) => {
    return await applicationContext.getUseCases().createJudgeUserInteractor({
      applicationContext,
      user: JSON.parse(event.body).user,
    });
  });
