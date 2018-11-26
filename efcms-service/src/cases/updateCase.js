const { updateCase } = require('ef-cms-shared/src/useCases/updateCase');
const { handle, getAuthHeader } = require('../middleware/apiGatewayHelper');

const {
  persistence: { saveCase },
  environment: { stage },
} = require('../applicationContext');

const applicationContext = {
  persistence: {
    saveCase,
  },
  environment: {
    stage,
  },
};

exports.put = event =>
  handle(() => {
    const userId = getAuthHeader(event);
    return updateCase({
      caseId: event.pathParameters.caseId,
      caseJson: JSON.parse(event.body),
      userId,
      applicationContext,
    });
  });
