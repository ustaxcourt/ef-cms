const { updateCase } = require('./middleware/caseMiddleware');
const { handle, getAuthHeader } = require('../middleware/apiGatewayHelper');

exports.put = async event =>

  handle(() => {
    const userToken = getAuthHeader(event);

    return updateCase({
      caseId: event.pathParameters.caseId,
      caseToUpdate: JSON.parse(event.body),
      userId: userToken
    });
  });