module.exports = {
  processStreamRecordsLambda: require('./streams/processStreamRecordsLambda')
    .processStreamRecordsLambda,
  reprocessFailedRecordsLambda: require('./streams/reprocessFailedRecordsLambda')
    .handler,
};
