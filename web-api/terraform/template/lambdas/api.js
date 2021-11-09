const awsServerlessExpress = require('@vendia/serverless-express');
const { app } = require('../../../src/app');

exports.handler = awsServerlessExpress({
  app,
});
