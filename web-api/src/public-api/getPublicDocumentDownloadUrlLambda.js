const createApplicationContext = require('../applicationContext');
const { redirect } = require('../middleware/apiGatewayHelper');

/**
 * used for fetching a single case
 *
 * @param {object} event the AWS event object
 * @returns {Promise<*|undefined>} the api gateway response object containing the statusCode, body, and headers
 */
exports.getPublicDocumentDownloadUrlLambda = event =>
  redirect(event, async () => {
    const applicationContext = createApplicationContext({});
    const honeybadger = applicationContext.initHoneybadger();
    try {
      const results = await applicationContext
        .getUseCases()
        .getPublicDownloadPolicyUrlInteractor({
          applicationContext,
          caseId: event.pathParameters.caseId,
          documentId: event.pathParameters.documentId,
        });
      applicationContext.logger.info('Results', results);
      return results;
    } catch (e) {
      applicationContext.logger.error(e);
      honeybadger && honeybadger.notify(e);
      throw e;
    }
  });
