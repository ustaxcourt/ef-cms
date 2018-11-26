const { getAuthHeader } = require('../middleware/apiGatewayHelper');
const createCase = require('../../../business/src/useCases/createCase');

const { handle } = require('../middleware/apiGatewayHelper');

const {
  persistence: { create, incrementCounter },
  environment: { stage },
  docketNumberGenerator: { createDocketNumber },
} = require('../applicationContext');

const applicationContext = {
  persistence: {
    create,
    incrementCounter,
  },
  docketNumberGenerator: {
    createDocketNumber,
  },
  environment: {
    stage,
  },
};

exports.create = event =>
  handle(() =>
    createCase({
      userId: getAuthHeader(event),
      documents: JSON.parse(event.body).documents,
      applicationContext,
    }),
  );
