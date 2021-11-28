const { processEntries } = require('./processEntries');

export const processWorkItemEntries = ({
  applicationContext,
  workItemRecords,
}) =>
  processEntries({
    applicationContext,
    recordType: 'workItemRecords',
    records: workItemRecords,
  });
