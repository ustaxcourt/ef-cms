import { getDbReader } from '@web-api/database';

export async function countRemainingChangeOfAddressJobIds(jobId: string) {
  return getDbReader(async reader => {
    const query = reader
      .selectFrom('dwChangeOfAddress')
      .where('jobId', '=', jobId);

    const remainingJobIds = await query
      .select(reader.fn.countAll().as('count'))
      .execute();

    return Number(remainingJobIds[0].count);
  });
}
