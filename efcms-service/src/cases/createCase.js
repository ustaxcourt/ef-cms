const createACase = require('../../../business/src/useCases/createACase');

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
    createACase({
      userId: JSON.parse(event.body).user,
      documents: JSON.parse(event.body).documents,
      applicationContext,
    })
  );
