import { pgDeleteFrom } from '@web-api/persistence/postgres/utils/operation/pgDeleteFrom';

export const deleteCaseDeadline = async ({
  caseDeadlineId,
}: {
  caseDeadlineId: string;
}) => {
  await pgDeleteFrom({
    table: 'dwCaseDeadline',
    where: qb => qb.where('caseDeadlineId', '=', caseDeadlineId),
  });
};
