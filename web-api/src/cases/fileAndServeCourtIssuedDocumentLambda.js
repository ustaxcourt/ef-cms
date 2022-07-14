const { genericHandler } = require('../genericHandler');

/**
 * File and serve court issued document
 *
 * @param {object} event the AWS event object
 */
exports.fileAndServeCourtIssuedDocumentLambda = event =>
  genericHandler(event, async ({ applicationContext }) => {
    return await applicationContext
      .getUseCases()
      .fileAndServeCourtIssuedDocumentInteractor(applicationContext, {
        ...JSON.parse(event.body),
      });
  });
