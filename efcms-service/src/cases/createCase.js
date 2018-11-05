const { createDone } = require('../services/gatewayHelper');
const caseService = require('./services/caseService');

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
    done(new Error('problem parsing event body: ' + error));
    return;
  }

  if (!body || !body.documents || !body.documents.constructor === Array || !body.documents.length == 3) {
    done(new Error('case initiation documents are required'));
    return;
  }

  //TODO validation on the endpoint for the POST body to match the swagger documents model

  let usernameTokenArray;
  if (event['headers'] && event['headers']['Authorization']) {
    usernameTokenArray = event['headers']['Authorization'].split(" ");
  } else {
    done(new Error('Authorization is required')); //temp until actual auth is added
    return;
  }

  if (!usernameTokenArray || !usernameTokenArray[1]) {
    done(new Error('Authorization is required')); //temp until actual auth is added
    return;
  }

  caseService
    .create(usernameTokenArray[1], body.documents)
    .then(caseRecord => {
      done(null, caseRecord);
    })
    .catch(done);
};
