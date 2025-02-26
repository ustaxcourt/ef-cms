import { CaseStatusChange } from '@shared/business/entities/cases/Case';
import { calculateDate } from '@shared/business/utilities/DateHandler';
import { getUniqueId } from '@shared/sharedAppContext';
import { pgInsertInto } from '@web-api/persistence/postgres/utils/operation/pgInsertInto';

export const upsertCaseStatusUpdates = async ({
  docketNumber,
  statusUpdates,
}: {
  docketNumber: string;
  statusUpdates: CaseStatusChange[];
}): Promise<void> => {
  await pgInsertInto({
    table: 'dwCaseStatusUpdate',
    values: statusUpdates.map(s => ({
      statusUpdateId: s.statusUpdateId ? s.statusUpdateId : getUniqueId(),
      changedBy: s.changedBy,
      date: calculateDate({ dateString: s.date }),
      docketNumber,
      updatedCaseStatus: s.updatedCaseStatus,
    })),
    onConflictColumns: ['statusUpdateId'],
  });
};
