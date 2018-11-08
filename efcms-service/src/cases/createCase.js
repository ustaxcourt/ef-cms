const { createDone, getAuthHeader } = require('../middleware/apiGatewayHelper');
const caseMiddleware = require('./middleware/caseMiddleware');

/**
 * Create Case API Lambda
 *
 * @param event
 * @param context
 * @param callback
 */

exports.create = (event, context, callback) => {
  const done = createDone(callback);

  let body;
  try {
    body = JSON.parse(event.body);
  } catch (error) {
    done(new Error('Error: problem parsing event body: ' + error));
    return;
  }

  let userToken;

  try {
    userToken = getAuthHeader(event);
  } catch (error) {
    done(error);
    return;
  }

  caseMiddleware
    .create(userToken, body.documents)
    .then(caseRecord => {
      done(null, caseRecord);
    })
    .catch(done);
};
