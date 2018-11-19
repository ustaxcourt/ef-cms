const { getAuthHeader } = require('../middleware/apiGatewayHelper');
const { handle } = require('../middleware/apiGatewayHelper');
const { getACase } = require('../../../business/src/useCases/getACase');

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
    getACase({
      userId: getAuthHeader(event),
      caseId: event.pathParameters.caseId,
      applicationContext,
    }),
  );
