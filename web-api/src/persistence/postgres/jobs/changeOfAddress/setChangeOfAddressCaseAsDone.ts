import { pgUpdateTable } from '@web-api/persistence/postgres/utils/operation/pgUpdateTable';
import { sql } from 'kysely';

export async function setChangeOfAddressCaseAsDone(jobId: string) {
  return await pgUpdateTable({
    table: 'dwChangeOfAddress',
    values: {
      remaining: sql<number>`remaining - 1`,
    },
    where: qb => qb.where('jobId', '=', jobId),
  });
}
