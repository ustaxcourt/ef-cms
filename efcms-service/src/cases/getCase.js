const { createDone, getAuthHeader } = require('../middleware/apiGatewayHelper');
const caseMiddleware = require('./middleware/caseMiddleware');

/**
 * GET Case API Lambda
 *
 * @param event
 * @param context
 * @param callback
 */

exports.get = (event, context, callback) => {
  const done = createDone(callback);

  let userToken;

  try {
    userToken = getAuthHeader(event);
  } catch (error) {
    done(error);
    return;
  }

  const caseId = event.pathParameters.caseId;

  caseMiddleware
    .getCase(userToken, caseId)
    .then(caseRecord => {
      done(null, caseRecord);
    })
    .catch(done);
};
