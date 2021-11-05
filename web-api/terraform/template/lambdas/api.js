const awsServerlessExpress = require('@vendia/serverless-express');
const { app } = require('../../../src/app');
const server = awsServerlessExpress({ app });

exports.handler = (event, context) => {
  event.body =
    typeof event.body === 'string' ? event.body : JSON.stringify(event.body);
  awsServerlessExpress.proxy(server, event, context);
};
