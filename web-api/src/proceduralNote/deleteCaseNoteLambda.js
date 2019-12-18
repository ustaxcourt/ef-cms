const createApplicationContext = require('../../applicationContext');
const { getUserFromAuthHeader } = require('../../middleware/apiGatewayHelper');
const { handle } = require('../../middleware/apiGatewayHelper');

/**
 * used for deleting a case note
 *
 * @param {object} event the AWS event object
 * @returns {Promise<*|undefined>} the api gateway response object containing the statusCode, body, and headers
 */
exports.handler = event =>
  handle(event, async () => {
    const user = getUserFromAuthHeader(event);
    const applicationContext = createApplicationContext(user);
    try {
      const { caseId } = event.pathParameters || {};
      const results = await applicationContext
        .getUseCases()
        .deleteCaseNoteInteractor({
          applicationContext,
          caseId,
        });
      applicationContext.logger.info('User', user);
      applicationContext.logger.info('Results', results);
      return results;
    } catch (e) {
      applicationContext.logger.error(e);
      throw e;
    }
  });
