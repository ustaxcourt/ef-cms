import { sql } from 'kysely';
import { pgUpdateTable } from '@web-api/persistence/postgres/utils/operation/pgUpdateTable';

export async function setChangeOfAddressCaseAsDone(jobId: string) {
  return await pgUpdateTable({
    table: 'dwChangeOfAddress',
    values: {
      remaining: sql`remaining - 1`,
    },
    where: qb => qb.where('jobId', '=', jobId),
  });
}
