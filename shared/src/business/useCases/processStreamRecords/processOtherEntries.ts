import { processEntries } from './processEntries';

export const processOtherEntries = ({
  applicationContext,
  otherRecords,
}: {
  applicationContext: IApplicationContext;
  otherRecords: any[];
}) =>
  processEntries({
    applicationContext,
    recordType: 'otherRecords',
    records: otherRecords,
  });
