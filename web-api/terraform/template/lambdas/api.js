const awsServerlessExpress = require('@vendia/serverless-express');
const { app } = require('../../../src/app');

exports.handler = (event, context) => {
  event.body =
    typeof event.body === 'string' ? event.body : JSON.stringify(event.body);
  return awsServerlessExpress({
    app,
  })(event, context);
};
