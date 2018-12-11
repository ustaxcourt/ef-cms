const { getAuthHeader } = require('../middleware/apiGatewayHelper');
const { handle } = require('../middleware/apiGatewayHelper');
const applicationContext = require('../applicationContext');

/**
 * createCase
 *
 * @param event
 * @returns {Promise<*|undefined>}
 */
exports.create = event =>
  handle(() =>
    applicationContext.getUseCases().createCase({
      userId: getAuthHeader(event),
      documents: JSON.parse(event.body).documents,
      applicationContext,
    }),
  );
