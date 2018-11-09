const { createDocument } = require('./services/documentBlobDAO');
const { handle } = require('../middleware/apiGatewayHelper');

/**
 * Create Document API Lambda
 *
 * @param event
 * @param context
 * @param callback
 */

// exports.create = (event, context, callback) => {
//   const done = createDone(callback);

//   let body;
//   try {
//     body = JSON.parse(event.body);
//   } catch (error) {
//     done(new Error('problem parsing event body: ' + error));
//     return;
//   }

//   if (!body || !body.documentType || !body.userId) {
//     done(new Error('documentType and userId are required'));
//     return;
//   }

//   documentService
//     .create(body.userId, body.documentType)
//     .then(document => {
//       done(null, document);
//     })
//     .catch(done);
// };

exports.create = async event =>
  handle(() =>
    createDocument(JSON.parse(event.body))
  )
