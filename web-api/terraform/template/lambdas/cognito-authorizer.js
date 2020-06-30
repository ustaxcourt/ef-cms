const jwk = require('jsonwebtoken');
const jwkToPem = require('jwk-to-pem');
const request = require('request');

const issMain = `https://cognito-idp.us-east-1.amazonaws.com/${process.env.USER_POOL_ID_MAIN}`;
const issIrs = `https://cognito-idp.us-east-1.amazonaws.com/${process.env.USER_POOL_ID_IRS}`;

const generatePolicy = (principalId, effect, resource) => {
  const authResponse = {};
  authResponse.principalId = principalId;
  if (effect && resource) {
    const policyDocument = {};
    policyDocument.Version = '2012-10-17';
    policyDocument.Statement = [];
    const statementOne = {};
    statementOne.Action = 'execute-api:Invoke';
    statementOne.Effect = effect;
    statementOne.Resource = resource;
    policyDocument.Statement[0] = statementOne;
    authResponse.policyDocument = policyDocument;
  }
  return authResponse;
};

const verify = (methodArn, token, keys, kid, cb) => {
  const k = keys.keys.find(k => k.kid === kid);
  const pem = jwkToPem(k);

  jwk.verify(token, pem, { issuer: [issMain, issIrs] }, (err, decoded) => {
    if (err) {
      console.log('Unauthorized user:', err.message);
      cb('Unauthorized');
    } else {
      cb(
        null,
        generatePolicy(
          decoded.sub,
          'Allow',
          methodArn.split('/').slice(0, 2).join('/') + '/*',
        ),
      );
    }
  });
};

let keys;

exports.handler = (event, context, cb) => {
  console.log('Auth function invoked');

  let requestToken = null;
  if (event.authorizationToken) {
    requestToken = event.authorizationToken.substring(7);
  } else if (event.queryStringParameters.token) {
    requestToken = event.queryStringParameters.token;
  }

  if (requestToken) {
    const { header, payload } = jwk.decode(requestToken, { complete: true });
    const { iss } = payload;
    const { kid } = header;
    if (keys) {
      verify(event.methodArn, requestToken, keys, kid, cb);
    } else {
      request(
        { json: true, url: `${iss}/.well-known/jwks.json` },
        (error, response, body) => {
          if (error || response.statusCode !== 200) {
            console.log('Request error:', error);
            cb('Unauthorized');
          }
          keys = body;
          verify(event.methodArn, requestToken, keys, kid, cb);
        },
      );
    }
  } else {
    console.log('No authorizationToken found in the header.');
    cb('Unauthorized');
  }
};
