module.exports = {
  processStreamRecordsLambda: require('./streams/processStreamRecordsLambda')
    .handler,
  reprocessFailedRecordsLambda: require('./streams/reprocessFailedRecordsLambda')
    .handler,
};
