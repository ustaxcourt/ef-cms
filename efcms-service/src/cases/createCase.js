const { getAuthHeader } = require('../middleware/apiGatewayHelper');
const createACase = require('../../../isomorphic/src/useCases/createACase');
const { handle } = require('../middleware/apiGatewayHelper');
const {
  create,
} = require('../../../isomorphic/src/persistence/awsDynamoPersistence');
const docketNumberGenerator = require('./middleware/docketNumberGenerator');

const applicationContext = {
  persistence: {
    create,
  },
  docketNumberGenerator,
};

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
