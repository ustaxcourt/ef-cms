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
    const pdfBuffer = await fun();
    return {
      body: pdfBuffer.toString('base64'),
      headers: {
        ...headers,
        'Content-Type': 'application/pdf',
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
 * create court issued order pdf from html
 *
 * @param {object} event the AWS event object
 * @returns {Promise<*|undefined>} the api gateway response object containing the statusCode, body, and headers
 */
exports.handler = event =>
  customHandle(event, async () => {
    const user = getUserFromAuthHeader(event);
    const applicationContext = createApplicationContext(user);
    try {
      const results = await applicationContext
        .getUseCases()
        .createCourtIssuedOrderPdfFromHtml({
          ...JSON.parse(event.body),
          applicationContext,
        });
      applicationContext.logger.info('User', user);
      applicationContext.logger.info('Results', results);
      return results;
    } catch (e) {
      applicationContext.logger.error(e);
      throw e;
    }
  });
