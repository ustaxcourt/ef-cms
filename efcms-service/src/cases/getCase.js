const { getAuthHeader } = require('../middleware/apiGatewayHelper');
const { handle } = require('../middleware/apiGatewayHelper');
const { getCase } = require('ef-cms-shared/src/useCases/getCase');

const {
  persistence: { get },
  environment: { stage },
} = require('../applicationContext');

const applicationContext = {
  persistence: {
    get,
  },
  environment: {
    stage,
  },
};

exports.get = event =>
  handle(() =>
    getCase({
      userId: getAuthHeader(event),
      caseId: event.pathParameters.caseId,
      applicationContext,
    }),
  );
