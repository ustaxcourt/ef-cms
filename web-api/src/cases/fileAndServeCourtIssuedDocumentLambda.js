const { genericHandler } = require('../genericHandler');

/**
 * fixme
 */
exports.fileAndServeCourtIssuedDocumentLambda = event =>
  genericHandler(
    event,
    async ({ applicationContext }) => {
      return await applicationContext
        .getUseCases()
        .fileAndServeCourtIssuedDocumentInteractor({
          ...JSON.parse(event.body),
          applicationContext,
        });
    },
    { logResults: false },
  );
