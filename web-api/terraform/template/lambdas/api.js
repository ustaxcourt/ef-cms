const awsServerlessExpress = require('@vendia/serverless-express');
const { app } = require('../../../src/app');

exports.handler = awsServerlessExpress({
  app,
  eventSourceName: 'AWS_API_GATEWAY_V1', // the serverless-express library has a bug, so we need to hard code this for now
});
