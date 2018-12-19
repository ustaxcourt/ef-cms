const { getAuthHeader } = require('../middleware/apiGatewayHelper');
const { handle } = require('../middleware/apiGatewayHelper');
const createApplicationContext = require('../applicationContext');

/**
 * createCase
 *
 * @param event
 * @returns {Promise<*|undefined>}
 */
exports.create = event =>
  handle(() => {
    const userId = getAuthHeader(event);
    const applicationContext = createApplicationContext({ userId });
    return applicationContext.getUseCases().createCase({
      userId,
      documents: JSON.parse(event.body).documents,
      applicationContext,
    });
  });
  
