const { getAuthHeader } = require('../middleware/apiGatewayHelper');
const createACase = require('../../../isomorphic/src/useCases/createACase');
const { handle } = require('../middleware/apiGatewayHelper');
const applicationContext = require('../applicationContext');

/**
 * Create Case API Lambda
 *
 * @param event
 * @param context
 * @param callback
 */

exports.create = event =>
  handle(() =>
    createACase({
      userId: getAuthHeader(event),
      documents: JSON.parse(event.body).documents,
      applicationContext,
    }),
  );
