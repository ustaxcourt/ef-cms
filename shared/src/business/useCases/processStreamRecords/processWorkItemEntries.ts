import { processEntries } from './processEntries';

export const processWorkItemEntries = ({
  applicationContext,
  workItemRecords,
}: {
  applicationContext: IApplicationContext;
  workItemRecords: any[];
}) =>
  processEntries({
    applicationContext,
    recordType: 'workItemRecords',
    records: workItemRecords,
  });
