const awsServerlessExpress = require('aws-serverless-express');
const { app: apiApp } = require('../../../src/app');
const { app: apiPublic } = require('../../../src/app-public');
const { verify } = require('./helpers');
const apiServer = awsServerlessExpress.createServer(apiApp);
const apiPublicServer = awsServerlessExpress.createServer(apiPublic);
const jwk = require('jsonwebtoken');
const request = require('request');

exports.apiHandler = (event, context) => {
  awsServerlessExpress.proxy(apiServer, event, context);
};

exports.apiPublicHandler = (event, context) => {
  awsServerlessExpress.proxy(apiPublicServer, event, context);
};

let keys;

exports.cognitoAuthorizerHandler = (event, context, cb) => {
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
