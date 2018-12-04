const { getAuthHeader } = require('../middleware/apiGatewayHelper');
const createCaseUC = require('ef-cms-shared/src/business/useCases/createCase');
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
    createCaseUC({
      userId: getAuthHeader(event),
      documents: JSON.parse(event.body).documents,
      applicationContext,
    }),
  );
