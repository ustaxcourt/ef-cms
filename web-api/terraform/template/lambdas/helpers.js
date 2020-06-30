const jwk = require('jsonwebtoken');
const jwkToPem = require('jwk-to-pem');

const issMain = `https://cognito-idp.us-east-1.amazonaws.com/${process.env.USER_POOL_ID_MAIN}`;
const issIrs = `https://cognito-idp.us-east-1.amazonaws.com/${process.env.USER_POOL_ID_IRS}`;

exports.generatePolicy = (principalId, effect, resource) => {
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

exports.verify = (methodArn, token, keys, kid, cb) => {
  const k = keys.keys.find(k => k.kid === kid);
  const pem = jwkToPem(k);

  jwk.verify(token, pem, { issuer: [issMain, issIrs] }, (err, decoded) => {
    if (err) {
      console.log('Unauthorized user:', err.message);
      cb('Unauthorized');
    } else {
      cb(
        null,
        exports.generatePolicy(
          decoded.sub,
          'Allow',
          methodArn.split('/').slice(0, 2).join('/') + '/*',
        ),
      );
    }
  });
};
