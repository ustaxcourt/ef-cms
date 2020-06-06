const awsServerlessExpress = require('aws-serverless-express');
const { app } = require('../../../src/app');
const server = awsServerlessExpress.createServer(app);

exports.handler = (event, context) => {
  console.log(event);
  awsServerlessExpress.proxy(server, event, context);
};

// exports.handler = async (event, context) => {
//   return {
//     body: JSON.stringify({
//       message: 'hello',
//     }),
//     headers: { 'Content-Type': 'application/json' },
//     statusCode: 200,
//   };
// };
