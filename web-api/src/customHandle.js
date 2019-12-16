const { headers, sendError, sendOk } = require('./middleware/apiGatewayHelper');

const {
  NotFoundError,
  UnauthorizedError,
} = require('../../shared/src/errors/errors');

exports.customHandle = async (event, fun) => {
  if (event.source === 'serverless-plugin-warmup') {
    return sendOk('Lambda is warm!');
  }
  try {
    const pdfBuffer = await fun();
    return {
      body: (pdfBuffer || []).toString('base64'),
      headers: {
        ...headers,
        'Content-Type': 'application/pdf',
        'accept-ranges': 'bytes',
      },
      isBase64Encoded: true,
      statusCode: 200,
    };
  } catch (err) {
    if (!process.env.CI) {
      console.error('err', err);
    }
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
