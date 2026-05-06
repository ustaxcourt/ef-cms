import { getDbReader } from '@web-api/persistence/postgres/database';

export async function getDocketNumberChangeOfAddress(
  jobId: string,
  docketNumber: string,
): Promise<
  {
    jobId: string;
    docketNumber: string;
  }[]
> {
  return getDbReader(async reader => {
    const result = reader
      .selectFrom('dwChangeOfAddress')
      .where('jobId', '=', jobId)
      .where('docketNumber', '=', docketNumber)
      .selectAll()
      .execute();

    return result;
  });
}
