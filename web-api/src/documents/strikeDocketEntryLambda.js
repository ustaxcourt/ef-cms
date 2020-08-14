const { genericHandler } = require('../genericHandler');

/**
 * used for signing PDF documents
 *
 * @param {object} event the AWS event object
 * @returns {Promise<*|undefined>} the api gateway response object containing the statusCode, body, and headers
 */
exports.strikeDocketEntryLambda = event =>
  genericHandler(
    event,
    async ({ applicationContext }) => {
      const {
        pathParameters: { docketNumber, documentId },
      } = event;

      return await applicationContext
        .getUseCases()
        .strikeDocketEntryInteractor({
          applicationContext,
          docketNumber,
          documentId,
        });
    },
    {
      logEvent: true,
    },
  );
