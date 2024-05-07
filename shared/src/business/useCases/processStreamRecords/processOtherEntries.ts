import { processEntries } from './processEntries';
import type { ServerApplicationContext } from '@web-api/applicationContext';

export const processOtherEntries = ({
  applicationContext,
  otherRecords,
}: {
  applicationContext: ServerApplicationContext;
  otherRecords: any[];
}) =>
  processEntries({
    applicationContext,
    recordType: 'otherRecords',
    records: otherRecords,
  });
