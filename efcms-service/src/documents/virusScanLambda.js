const createApplicationContext = require('../applicationContext');
const {
  handle,
  // getUserFromAuthHeader,
} = require('../middleware/apiGatewayHelper');
const { promises: fs } = require('fs');

exports.handler = event =>
  handle(event, async () => {
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
    const documentId = event.pathParameters.documentId;

    try {
      // download S3 doc to /tmp dir
      const documentObject = await applicationContext
        .getPersistenceGateway()
        .getDocument({
          applicationContext,
          documentId,
        });

      await fs.writeFile('/tmp/document.pdf', documentObject);

      return 'Welcome to Flavortown.';
    } catch (e) {
      applicationContext.logger.error(e);
      throw e;
    }
  });
