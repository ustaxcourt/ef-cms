const createACase = require('../../../isomorphic/src/useCases/createACase');

const { handle, getAuthHeader } = require('../middleware/apiGatewayHelper');
const { createDocketNumber } = require('./middleware/docketNumberGenerator');

const {
  persistence: { create: create },
  environment: { stage: stage },
} = require('../applicationContext');

const applicationContext = {
  persistence: {
    create,
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
