const { handler } = require('./cognito-triggers');

/**
 * used for invoking cognito triggers locally
 *
 * @param {object} event the AWS event object
 * @returns {Promise<*|undefined>} the api gateway response object containing the statusCode, body, and headers
 */
exports.cognitoTriggersLocalLambda = async event => {
  await handler(event.body);
};
