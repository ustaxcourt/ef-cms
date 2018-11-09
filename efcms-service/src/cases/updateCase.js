const { updateCase } = require('./middleware/caseMiddleware');
const { handle } = require('../middleware/apiGatewayHelper');

exports.put = async event =>
  handle(() =>
    updateCase({
      caseId: event.pathParameters.caseId,
      caseToUpdate: JSON.parse(event.body)
    })
  );