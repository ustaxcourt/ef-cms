const { getAuthHeader } = require('../middleware/apiGatewayHelper');

const createDocumentMetadata = require('../../../business/src/useCases/createDocumentMetadata');
const { handle } = require('../middleware/apiGatewayHelper');

/**
 * Create Document API Lambda
 *
 * @param event
 * @param context
 * @param callback
 */

const {
  persistence: { create },
  environment: { stage },
} = require('../applicationContext');

const applicationContext = {
  persistence: {
    create,
  },
  environment: {
    stage,
  },
};

exports.create = event =>
  handle(() =>
    createDocumentMetadata({
      document: {
        ...JSON.parse(event.body),
        userId: getAuthHeader(event),
      },
      applicationContext,
    }),
  );
