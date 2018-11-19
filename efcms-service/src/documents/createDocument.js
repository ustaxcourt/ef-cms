const createDocument = require('../../../business/src/useCases/createDocument');
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
  environment: { stage }
} = require('../applicationContext');

const applicationContext = {
  persistence: {
    create
  },
  environment: {
    stage,
  },
};

exports.create = event =>
  handle(() =>
    createDocument({
      document: JSON.parse(event.body),
      applicationContext,
    }),
  );
