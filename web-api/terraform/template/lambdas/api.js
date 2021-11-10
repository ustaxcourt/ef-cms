const awsServerlessExpress = require('@vendia/serverless-express');
const { app } = require('../../../src/app');

exports.handler = (event, context) => {
  // This is a hack needed for when we use async api gateway events.  Normal api gateway requests
  // will send event.body as a string, but for async events with the X-Amz-Invocation-Type header,
  // this will be an object which causes serverless-express to crash.
  console.log('we got an event', event);
  console.log(JSON.stringify(event, null, 2));
  event.body =
    typeof event.body === 'string' ? event.body : JSON.stringify(event.body);
  return awsServerlessExpress({
    app,
  })(event, context);
};
