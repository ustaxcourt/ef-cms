import { CaseStatusChange } from '@shared/business/entities/cases/Case';
import { getDbReader } from '@web-api/database';

export const getCaseStatusHistory = async ({
  docketNumber,
}: {
  docketNumber: string;
}): Promise<CaseStatusChange[]> => {
  const dbCaseStatusHistory = await getDbReader(reader =>
    reader
      .selectFrom('dwCaseStatusUpdate')
      .where('docketNumber', '=', docketNumber)
      .orderBy('date asc')
      .selectAll()
      .execute(),
  );
  const caseStatusHistory = dbCaseStatusHistory.map(update => {
    return { ...update, date: update.date.toISOString() };
  });

  return caseStatusHistory;
};
