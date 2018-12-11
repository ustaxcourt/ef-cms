const { getAuthHeader } = require('../middleware/apiGatewayHelper');
const { handle } = require('../middleware/apiGatewayHelper');
const { createCase } = require('ef-cms-shared/src/business/useCases/createCase.interactor');
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
