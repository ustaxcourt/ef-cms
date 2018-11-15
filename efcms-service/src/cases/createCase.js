const createACase = require('../../../isomorphic/src/useCases/createACase');

const { handle, getAuthHeader } = require('../middleware/apiGatewayHelper');

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
    createACase({
      userId: getAuthHeader(event),
      documents: JSON.parse(event.body).documents,
      applicationContext,
    }),
  );
