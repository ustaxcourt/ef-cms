import { getDbReader } from '@web-api/database';

export async function countRemainingChangeOfAddressCases(
  jobId: string,
): Promise<number> {
  return getDbReader(async reader => {
    const query = reader
      .selectFrom('dwChangeOfAddress')
      .where('jobId', '=', jobId);

    const remainingCases = await query
      .select(reader.fn.countAll().as('count'))
      .execute();

    return Number(remainingCases[0].count);
  });
}
