import {
  APIGatewayAuthorizerResult,
  APIGatewayRequestAuthorizerEvent,
} from 'aws-lambda';
import { createPublicKey } from 'crypto';
import { environment } from '@web-api/environment';
import { getLogger } from '@web-api/utilities/logger/getLogger';
import axios from 'axios';
import jwk from 'jsonwebtoken';

const issMain = `https://cognito-idp.us-east-1.amazonaws.com/${environment.userPoolId}`;
const issIrs = `https://cognito-idp.us-east-1.amazonaws.com/${environment.userPoolIrsId}`;

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

const verify = (key, token) =>
  new Promise((resolve, reject) => {
    const pem = createPublicKey({
      format: 'jwk',
      key,
    })
      .export({ format: 'pem', type: 'spki' })
      .toString();

    const options = { issuer: [issMain, issIrs] };

    jwk.verify(token, pem, options, (err, payload) => {
      if (err) {
        reject(err);
      } else {
        resolve(payload);
      }
    });
  });

const throw401GatewayError = () => {
  throw new Error('Unauthorized');
};

export const createAuthorizer =
  getToken => async (event: APIGatewayRequestAuthorizerEvent, context) => {
    const logger = getLogger();
    logger.clearContext();
    logger.addContext({
      environment: {
        stage: process.env.STAGE,
      },
      requestId: {
        authorizer: context.awsRequestId,
      },
    });

    let token;
    try {
      token = getToken(event);
    } catch (error) {
      logger.info('An error occured trying to get the token out of the event');
      throw401GatewayError();
    }

    if (!token) {
      logger.info('No authorizationToken found in the header');
      throw401GatewayError();
    }

    let iss, kid;

    try {
      const decodedToken = decodeToken(token);
      ({ iss, kid } = decodedToken);
    } catch (error) {
      logger.info(
        'The token provided in the header could not be decoded successfully',
      );
      throw401GatewayError();
    }

    let keys;
    try {
      keys = await getKeysForIssuer(iss);
    } catch (error) {
      logger.warn(
        'Could not fetch keys for token issuer, considering request unauthorized',
        error,
      );
      throw401GatewayError();
    }

    const key = keys.find(k => k.kid === kid);

    if (!key) {
      logger.warn(
        'The key used to sign the authorization token was not found in the user pool’s keys, considering request unauthorized',
        {
          issuer: iss,
          keys,
          requestedKeyId: kid,
        },
      );
      throw401GatewayError();
    }

    let payload;
    try {
      payload = await verify(key, token);
    } catch (error) {
      logger.warn(
        'The token is not valid, considering request unauthorized',
        error,
      );
      throw401GatewayError();
    }

    const allowPolicy = createAllowPolicy(event, payload['custom:userId']);

    logger.info('Request authorized', {
      metadata: { policy: allowPolicy },
    });

    return allowPolicy;
  };

function createAllowPolicy(
  event: APIGatewayRequestAuthorizerEvent,
  principalId: string,
): APIGatewayAuthorizerResult {
  return {
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
    principalId,
  };
}
