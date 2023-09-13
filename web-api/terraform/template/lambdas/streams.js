const {
  processStreamRecordsLambda,
} = require('../../../src/lambdas/streams/processStreamRecordsLambda');

exports.handler = processStreamRecordsLambda;
