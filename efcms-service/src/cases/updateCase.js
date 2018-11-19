const { updateCase } = require('./middleware/caseMiddleware');
const { handle, getAuthHeader } = require('../middleware/apiGatewayHelper');

exports.put = event =>
  handle(() => {
    const userId = getAuthHeader(event);
    return updateCase({
      caseId: event.pathParameters.caseId,
      caseToUpdate: JSON.parse(event.body),
      userId,
    })
  });