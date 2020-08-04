const createApplicationContext = require('../applicationContext');
const { genericHandler } = require('../genericHandler');

/**
 * used for fetching a single case
 *
 * @param {object} event the AWS event object
 * @returns {Promise<*|undefined>} the api gateway response object containing the statusCode, body, and headers
 */
exports.getPublicDocumentDownloadUrlLambda = event =>
  genericHandler(event, async () => {
    const applicationContext = createApplicationContext({});
    try {
      const results = await applicationContext
        .getUseCases()
        .getPublicDownloadPolicyUrlInteractor({
          applicationContext,
          ...event.pathParameters,
        });
      applicationContext.logger.info('Results', results);
      return results;
    } catch (e) {
      applicationContext.logger.error(e);
      await applicationContext.notifyHoneybadger(e);
      throw e;
    }
  });
