import { pgDeleteFrom } from '@web-api/persistence/postgres/utils/operation/pgDeleteFrom';

export async function setChangeOfAddressCaseAsDone(
  jobId: string,
  docketNumber: string,
) {
  return await pgDeleteFrom({
    table: 'dwChangeOfAddress',
    where: qb =>
      qb.where('jobId', '=', jobId).where('docketNumber', '=', docketNumber),
  });
}
