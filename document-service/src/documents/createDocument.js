const documentService = require('./documentService');

/**
 * Create Document API Lambda
 *
 * @param event
 * @param context
 * @param callback
 */

exports.create = (event, context, callback) => {
  const done = (err, res) => callback(null, {
    statusCode: err ? '400' : '200',
    body: err ? JSON.stringify(err.message) : JSON.stringify(res),
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*'
    },
  });

  const body = JSON.parse(event.body);

  if (!body || !body.documentType) {
    done(new Error('documentType is required'));
  }

  return documentService.create(body.userId, body.documentType)
    .then(document => {
      done(null, document);
    })
    .catch(done);
};