const { getAuthHeader } = require('../middleware/apiGatewayHelper');
const { createCase } = require('ef-cms-shared/src/useCases/createCase');
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
    createCase({
      userId: getAuthHeader(event),
      documents: JSON.parse(event.body).documents,
      applicationContext,
    }),
  );
