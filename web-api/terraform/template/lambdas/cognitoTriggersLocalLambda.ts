import { handler } from './cognito-triggers';

/**
 * used for invoking cognito triggers locally
 * @param {object} event the AWS event object
 * @returns {Promise<*|undefined>} the api gateway response object containing the statusCode, body, and headers
 */
export const cognitoTriggersLocalLambda = async event => {
  const cognitoEvent = JSON.parse(event.body);

  return await handler(cognitoEvent);
};
