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

/**
 * lambda for creating the printable trial calendar
 *
 * @param {object} event the AWS event object
 * @returns {Promise<*|undefined>} the api gateway response object containing the statusCode, body, and headers
 */

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

exports.handler = event =>
  customHandle(event, async () => {
    const user = getUserFromAuthHeader(event);
    const applicationContext = createApplicationContext(user);
    const { trialSessionId } = JSON.parse(event.body);

    try {
      const result = await applicationContext
        .getUseCases()
        .generateTrialCalendarPdfInteractor({
          applicationContext,
          trialSessionId,
        });
      applicationContext.logger.info('User', user);
      return result;
    } catch (e) {
      applicationContext.logger.error(e);
      throw e;
    }
  });
