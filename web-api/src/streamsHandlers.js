import 'core-js/stable';
import 'regenerator-runtime/runtime';

module.exports = {
  processStreamRecordsLambda: require('./streams/processStreamRecordsLambda')
    .handler,
};
