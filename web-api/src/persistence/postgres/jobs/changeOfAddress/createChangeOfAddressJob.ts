import { pgInsertInto } from '@web-api/persistence/postgres/utils/operation/pgInsertInto';

export async function createChangeOfAddressJob({
  docketNumbers,
  jobId,
}: {
  jobId: string;
  docketNumbers: string[];
}) {
  await pgInsertInto({
    table: 'dwChangeOfAddress',
    values: [
      {
        jobId,
        remaining: docketNumbers.length,
      },
    ],
  });
}
