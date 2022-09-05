const { processEntries } = require('./processEntries');

exports.processWorkItemEntries = ({ applicationContext, workItemRecords }) =>
  processEntries({
    applicationContext,
    recordType: 'workItemRecords',
    records: workItemRecords,
  });
