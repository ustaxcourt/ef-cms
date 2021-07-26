const axios = require('axios');
const jwk = require('jsonwebtoken');
const jwkToPem = require('jwk-to-pem');
const {
  createLogger,
} = require('../../../../shared/src/utilities/createLogger');
const { transports } = require('winston');

const transport = new transports.Console({
  handleExceptions: true,
  handleRejections: true,
});

const issMain = `https://cognito-idp.us-east-1.amazonaws.com/${process.env.USER_POOL_ID_MAIN}`;
const issIrs = `https://cognito-idp.us-east-1.amazonaws.com/${process.env.USER_POOL_ID_IRS}`;

const getLogger = context => {
  return createLogger({
    defaultMeta: {
      environment: {
        stage: process.env.STAGE,
      },
      requestId: {
        authorizer: context.awsRequestId,
      },
    },
    logLevel: context.logLevel,
    transports: [transport],
  });
};

const getToken = event => {
  if (event.queryStringParameters && event.queryStringParameters.token) {
    return event.queryStringParameters.token;
  } else if (event.authorizationToken) {
    return event.authorizationToken.substring(7);
  }
};

const decodeToken = requestToken => {
  const { header, payload } = jwk.decode(requestToken, { complete: true });
  return { iss: payload.iss, kid: header.kid };
};

let keyCache = {};
const getKeysForIssuer = async iss => {
  if (keyCache[iss]) {
    return keyCache[iss];
  }

  const response = await axios.get(`${iss}/.well-known/jwks.json`);

  return (keyCache[iss] = response.data.keys);
};

const verify = async (key, token) => {
  return new Promise((resolve, reject) => {
    const pem = jwkToPem(key);
    const options = { issuer: [issMain, issIrs] };

    jwk.verify(token, pem, options, (err, payload) => {
      if (err) {
        reject(err);
      } else {
        resolve(payload);
      }
    });
  });
};

exports.handler = async (event, context) => {
  const logger = getLogger(context);
  const token = getToken(event);

  if (!token) {
    logger.info('No authorizationToken found in the header');

    throw new Error('Unauthorized'); // Magic string to return 401
  }

  const { iss, kid } = decodeToken(token);

  let keys;
  try {
    keys = await getKeysForIssuer(iss);
  } catch (error) {
    logger.warning(
      'Could not fetch keys for token issuer, considering request unauthorized',
      error,
    );

    throw new Error('Unauthorized'); // Magic string to return 401
  }

  const key = keys.find(k => k.kid === kid);

  if (!key) {
    logger.warning(
      'The key used to sign the authorization token was not found in the user pool’s keys, considering request unauthorized',
      {
        issuer: iss,
        keys,
        requestedKeyId: kid,
      },
    );

    throw new Error('Unauthorized'); // Magic string to return 401
  }

  let payload;
  try {
    payload = await verify(key, token);
  } catch (error) {
    logger.warning(
      'The token is not valid, considering request unauthorized',
      error,
    );

    throw new Error('Unauthorized'); // Magic string to return 401
  }

  const policy = {
    policyDocument: {
      Statement: [
        {
          Action: 'execute-api:Invoke',
          Effect: 'Allow',
          Resource: event.methodArn.split('/').slice(0, 2).join('/') + '/*',
        },
      ],
      Version: '2012-10-17',
    },
    principalId: payload['custom:userId'] || payload.sub,
  };

  logger.info('Request authorized', {
    metadata: { policy },
  });

  return policy;
};
