const createApplicationContext = require('../applicationContext');
const { genericHandler } = require('../genericHandler');
const { getUserFromAuthHeader } = require('../middleware/apiGatewayHelper');

/**
 * used for getting the download policy which is needed for users to download files directly from S3 via the UI
 *
 * @param {object} event the AWS event object
 * @returns {Promise<*|undefined>} the api gateway response object containing the statusCode, body, and headers
 */
exports.getDocumentDownloadUrlLambda = event =>
  genericHandler(event, async () => {
    const user = getUserFromAuthHeader(event);
    const applicationContext = createApplicationContext(user);
    try {
      const results = await applicationContext
        .getUseCases()
        .getDownloadPolicyUrlInteractor({
          applicationContext,
          caseId: event.pathParameters.caseId,
          documentId: event.pathParameters.documentId,
        });
      applicationContext.logger.info('User', user);
      applicationContext.logger.info('Results', results);
      return results;
    } catch (e) {
      applicationContext.logger.error(e);
      await applicationContext.notifyHoneybadger(e);
      throw e;
    }
  });
