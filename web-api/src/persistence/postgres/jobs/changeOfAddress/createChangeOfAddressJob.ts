import { pgInsertInto } from '@web-api/persistence/postgres/utils/operation/pgInsertInto';

export async function createChangeOfAddressJob({
  docketNumbers,
  jobId,
}: {
  jobId: string;
  docketNumbers: string[];
}) {
  const values = docketNumbers.map(docketNumber => {
    return {
      jobId,
      docketNumber,
    };
  });

  await pgInsertInto({
    table: 'dwChangeOfAddress',
    values,
  });
}
