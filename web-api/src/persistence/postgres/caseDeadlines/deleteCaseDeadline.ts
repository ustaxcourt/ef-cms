import { getDbWriter } from '@web-api/database';

export const deleteCaseDeadline = async ({
  caseDeadlineId,
}: {
  caseDeadlineId: string;
}) => {
  await getDbWriter(writer =>
    writer
      .deleteFrom('dwCaseDeadline')
      .where('caseDeadlineId', '=', caseDeadlineId)
      .execute(),
  );
};
