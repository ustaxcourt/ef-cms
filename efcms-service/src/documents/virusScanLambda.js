const createApplicationContext = require('../applicationContext');
const {
  handle,
  getUserFromAuthHeader,
} = require('../middleware/apiGatewayHelper');

/**
 * creates a new document and attaches it to a case.  It also creates a work item on the docket section.
 *
 * @param {Object} event the AWS event object
 * @returns {Promise<*|undefined>} the api gateway response object containing the statusCode, body, and headers
 */
exports.handler = event =>
  handle(event, async () => {
    const documentId = event.pathParameters.documentId;
    // const user = getUserFromAuthHeader(event);
    const applicationContext = createApplicationContext({
      at_hash: 'sgapA2ZMWplnvqZDxFYEsQ',
      aud: '6tu6j1stv5ugcut7dqsqdurn8q',
      auth_time: 1550154248,
      'cognito:username': 'a46afe60-ad3a-47ae-bd49-43d6d62aa469',
      'custom:role': 'petitioner',
      email: 'petitioner1@example.com',
      email_verified: false,
      event_id: '30b0b2b2-3064-11e9-994b-75200a6e47a3',
      exp: 1550157848,
      iat: 1550154248,
      iss: 'https://cognito-idp.us-east-1.amazonaws.com/us-east-1_7uRkF0Axn',
      name: 'Test Petitioner',
      sub: 'a46afe60-ad3a-47ae-bd49-43d6d62aa469',
      token_use: 'id',
    });
    try {
      const results = await applicationContext.getUseCases().virusScanDocument({
        applicationContext,
        documentId,
        user: JSON.parse(event.body),
      });
      applicationContext.logger.info('User', user);
      applicationContext.logger.info('Results', results);
      return results;
    } catch (e) {
      applicationContext.logger.error(e);
      throw e;
    }
  });
