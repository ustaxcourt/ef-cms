// const { genericHandler } = require('../../../src/genericHandler');
const { handler } = require('./cognito-triggers');

/**
 * used for invoking cognito triggers locally
 *
 * @param {object} event the AWS event object
 * @returns {Promise<*|undefined>} the api gateway response object containing the statusCode, body, and headers
 */
exports.cognitoTriggersLocalLambda = async event => {
  //   genericHandler(event, async () => {
  //     await handler(event.body);
  //   });
  console.log('?????event', event);
  event = event.body;
  console.log('?????event.body', event);
  //   event = JSON.parse(event);
  await handler(event);
};
