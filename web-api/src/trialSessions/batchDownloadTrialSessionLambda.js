const createApplicationContext = require('../applicationContext');
const { getUserFromAuthHeader } = require('../middleware/apiGatewayHelper');

/**
 * batch download trial session
 *
 * @param {object} event the AWS event object
 * @returns {Promise<*|undefined>} the api gateway response object containing the statusCode, body, and headers
 */
exports.handler = async event => {
  const user = getUserFromAuthHeader(event);
  const applicationContext = createApplicationContext(user);
  try {
    const { trialSessionId } = event.path || {};
    const {
      zipBuffer,
      zipName,
    } = await applicationContext
      .getUseCases()
      .batchDownloadTrialSessionInteractor({
        applicationContext,
        trialSessionId,
      });
    applicationContext.logger.info('User', user);
    applicationContext.logger.info('Results', zipName);
    return {
      body: zipBuffer.toString('base64'),
      headers: {
        'Content-Disposition': `attachment; filename=${zipName}`,
        'Content-Type': 'application/zip',
      },
    };
  } catch (e) {
    applicationContext.logger.error(e);
    throw e;
  }
};
