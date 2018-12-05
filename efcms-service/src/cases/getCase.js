const { getAuthHeader } = require('../middleware/apiGatewayHelper');
const { handle } = require('../middleware/apiGatewayHelper');
const { getCase } = require('ef-cms-shared/src/business/useCases/getCase');
const applicationContext = require('../applicationContext');

/**
 * getCase
 *
 * @param event
 * @returns {Promise<*|undefined>}
 */
exports.get = event =>
  handle(() =>
    getCase({
      userId: getAuthHeader(event),
      caseId: event.pathParameters.caseId,
      applicationContext,
    }),
  );
