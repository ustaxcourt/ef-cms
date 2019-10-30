require('core-js/stable');
require('regenerator-runtime/runtime');

module.exports = {
  processStreamRecordsLambda: require('./streams/processStreamRecordsLambda')
    .handler,
};
