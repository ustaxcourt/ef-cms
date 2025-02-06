import { CaseStatusChange } from '@shared/business/entities/cases/Case';
import { calculateDate } from '@shared/business/utilities/DateHandler';
import { getDbWriter } from '@web-api/database';
import { isEmpty } from 'lodash';

export const upsertCaseStatusUpdates = async ({
  docketNumber,
  statusUpdates,
}: {
  docketNumber: string;
  statusUpdates: CaseStatusChange[];
}): Promise<void> => {
  if (isEmpty(statusUpdates)) {
    return;
  }

  await getDbWriter(writer =>
    writer
      .insertInto('dwCaseStatusUpdate')
      .values(
        statusUpdates.map(s => ({
          changedBy: s.changedBy,
          date: calculateDate({ dateString: s.date }),
          docketNumber,
          updatedCaseStatus: s.updatedCaseStatus,
        })),
      )
      .onConflict(oc =>
        oc.columns(['docketNumber', 'date']).doUpdateSet(s => {
          return {
            changedBy: s.ref('excluded.changedBy'),
            date: s.ref('excluded.date'),
            updatedCaseStatus: s.ref('excluded.updatedCaseStatus'),
          };
        }),
      )
      .execute(),
  );
};
