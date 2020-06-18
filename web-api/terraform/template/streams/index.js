const {
  processStreamRecordsLambda,
} = require('../../../src/streams/processStreamRecordsLambda');

exports.handler = async event => {
  return processStreamRecordsLambda(event);
};
