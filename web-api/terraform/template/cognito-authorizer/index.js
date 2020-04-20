const jwk = require('jsonwebtoken');
const jwkToPem = require('jwk-to-pem');
const request = require('request');

const issMain = `https://cognito-idp.us-east-1.amazonaws.com/${process.env.USER_POOL_ID_MAIN}`;
const issIrs = `https://cognito-idp.us-east-1.amazonaws.com/${process.env.USER_POOL_ID_IRS}`;

let pem;

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

const verify = (token, pem, cb) => {
  jwk.verify(token, pem, { issuer: [issMain, issIrs] }, (err, decoded) => {
    if (err) {
      console.log('Unauthorized user:', err.message);
      cb('Unauthorized');
    } else {
      cb(null, generatePolicy(decoded.sub, 'Allow', event.methodArn));
    }
  });
};

module.exports.handler = (event, context, cb) => {
  console.log('Auth function invoked');
  if (event.authorizationToken) {
    // Remove 'bearer ' from token:
    const token = event.authorizationToken.substring(7);

    const { iss } = jwk.decode(token);
    if (pem) {
      verify(token, pem, cb);
    } else {
      request(
        { json: true, url: `${iss}/.well-known/jwks.json` },
        (error, response, body) => {
          if (error || response.statusCode !== 200) {
            console.log('Request error:', error);
            cb('Unauthorized');
          }
          const keys = body;
          const k = keys.keys[0];
          const jwkArray = {
            e: k.e,
            kty: k.kty,
            n: k.n,
          };
          pem = jwkToPem(jwkArray);
          verify(token, pem, cb);
        },
      );
    }
  } else {
    console.log('No authorizationToken found in the header.');
    cb('Unauthorized');
  }
};
