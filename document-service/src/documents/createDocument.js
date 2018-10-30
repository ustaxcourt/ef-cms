const documentService = require('./documentService');

/**
 * Create Document API Lambda
 *
 * @param event
 * @param context
 * @param callback
 */

exports.create = (event, context, callback) => {
  const done = (err, res) =>
    callback(null, {
      statusCode: err ? '400' : '200',
      body: err ? JSON.stringify(err.message) : JSON.stringify(res),
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    });

  let body;
  try {
    body = JSON.parse(event.body);
  } catch (error) {
    done(new Error('problem parsing event body: ' + error));
    return;
  }

  if (!body || !body.documentType || !body.userId) {
    done(new Error('documentType and userId are required'));
    return;
  }

  return documentService
    .create(body.userId, body.documentType)
    .then(document => {
      done(null, document);
    })
    .catch(done);
};
