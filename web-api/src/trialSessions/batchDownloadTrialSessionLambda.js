const createApplicationContext = require('../applicationContext');
const {
  headers,
  sendError,
  sendOk,
} = require('../middleware/apiGatewayHelper');
const {
  NotFoundError,
  UnauthorizedError,
} = require('../../../shared/src/errors/errors');
const { getUserFromAuthHeader } = require('../middleware/apiGatewayHelper');

const customHandle = async (event, fun) => {
  if (event.source === 'serverless-plugin-warmup') {
    return sendOk('Lambda is warm!');
  }
  try {
    const { zipBuffer, zipName } = await fun();
    return {
      body: zipBuffer.toString('base64'),
      headers: {
        ...headers,
        'Content-Disposition': `attachment; filename=${zipName}`,
        'Content-Type': 'application/zip',
        'accept-ranges': 'bytes',
      },
      isBase64Encoded: true,
      statusCode: 200,
    };
  } catch (err) {
    console.error('err', err);
    if (err instanceof NotFoundError) {
      err.statusCode = 404;
      return sendError(err);
    } else if (err instanceof UnauthorizedError) {
      err.statusCode = 403;
      return sendError(err);
    } else {
      return sendError(err);
    }
  }
};

/**
 * batch download trial session
 *
 * @param {object} event the AWS event object
 * @returns {Promise<*|undefined>} the api gateway response object containing the statusCode, body, and headers
 */
exports.handler = event =>
  customHandle(event, async () => {
    const user = getUserFromAuthHeader(event);
    const applicationContext = createApplicationContext(user);
    try {
      const { trialSessionId } = event.pathParameters || {};
      const results = await applicationContext
        .getUseCases()
        .batchDownloadTrialSessionInteractor({
          applicationContext,
          trialSessionId,
        });
      applicationContext.logger.info('User', user);
      applicationContext.logger.info('Results', results);
      return results;
    } catch (e) {
      applicationContext.logger.error(e);
      throw e;
    }
  });
