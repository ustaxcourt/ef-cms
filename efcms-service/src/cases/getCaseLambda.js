const createApplicationContext = require('../applicationContext');
const { getUserFromAuthHeader } = require('../middleware/apiGatewayHelper');
const { handle } = require('../middleware/apiGatewayHelper');

/**
 * used for fetching a single case
 *
 * @param {Object} event the AWS event object
 * @returns {Promise<*|undefined>} the api gateway response object containing the statusCode, body, and headers
 */
exports.handler = event =>
  handle(event, async () => {
    try {
      const user = getUserFromAuthHeader(event);
      const applicationContext = createApplicationContext(user);
      const caseDetail = await applicationContext.getUseCases().getCase({
        applicationContext,
        caseId: event.pathParameters.caseId,
      });
      console.log('user', JSON.stringify(user));
      console.log('case', JSON.stringify(caseDetail));
      return caseDetail;
    } catch (e) {
      console.error('error', JSON.stringify(e));
      throw e;
    }
  });
