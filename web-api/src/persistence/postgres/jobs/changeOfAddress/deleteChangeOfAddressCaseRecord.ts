import { pgDeleteFrom } from '@web-api/persistence/postgres/utils/operation/pgDeleteFrom';

export async function deleteChangeOfAddressCaseRecord(jobId: string) {
  await pgDeleteFrom({
    table: 'dwChangeOfAddress',
    where: cb => cb.where('jobId', '=', jobId),
  });
}
