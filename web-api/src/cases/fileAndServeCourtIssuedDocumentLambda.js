const { genericHandler } = require('../genericHandler');
const { getConnectionIdFromEvent } = require('../middleware/apiGatewayHelper');

/**
 * File and serve court issued document
 *
 * @param {object} event the AWS event object
 */
exports.fileAndServeCourtIssuedDocumentLambda = event => {
  const clientConnectionId = getConnectionIdFromEvent(event);
  genericHandler(event, async ({ applicationContext }) => {
    return await applicationContext
      .getUseCases()
      .fileAndServeCourtIssuedDocumentInteractor(
        applicationContext,
        {
          ...JSON.parse(event.body),
        },
        clientConnectionId,
      );
  });
};
