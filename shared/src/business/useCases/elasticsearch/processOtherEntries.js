const { processEntries } = require('./processEntries');

exports.processOtherEntries = ({ applicationContext, otherRecords }) =>
  processEntries({
    applicationContext,
    recordType: 'otherRecords',
    records: otherRecords,
  });
