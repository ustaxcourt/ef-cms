const awsServerlessExpress = require('@vendia/serverless-express');
const { app } = require('../../../src/app-public');

exports.handler = awsServerlessExpress({ app });
