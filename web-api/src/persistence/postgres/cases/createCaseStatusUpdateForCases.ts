import { CaseStatusChange } from '@shared/business/entities/cases/Case';
import { calculateDate } from '@shared/business/utilities/DateHandler';
import { getUniqueId } from '@shared/sharedAppContext';
import { pgInsertInto } from '@web-api/persistence/postgres/utils/operation/pgInsertInto';

export const createCaseStatusUpdateForCases = async ({
  docketNumbers,
  statusUpdate,
}: {
  docketNumbers: string[];
  statusUpdate: CaseStatusChange;
}): Promise<void> => {
  await pgInsertInto({
    table: 'dwCaseStatusUpdate',
    values: docketNumbers.map(docketNumber => ({
      docketNumber,
      ...{
        statusUpdateId: statusUpdate.statusUpdateId
          ? statusUpdate.statusUpdateId
          : getUniqueId(),
        changedBy: statusUpdate.changedBy,
        date: calculateDate({ dateString: statusUpdate.date }),
        updatedCaseStatus: statusUpdate.updatedCaseStatus,
      },
    })),
    onConflictColumns: ['statusUpdateId'],
  });
};
