import { getDbReader } from '@web-api/persistence/postgres/database';
import {
  attachDocketEntriesToWorkItemQC,
  workItemQCQueryBase,
} from '@web-api/persistence/postgres/workitems/getDocumentQCInboxForUser';
import {
  RawWorkItemWithCaseAndDocketEntryInfo,
  WorkItemWithCaseInfoKysely,
} from '@web-api/persistence/postgres/workitems/schema';

export const getDocumentQCServedForUser = async ({
  afterDate,
  userId,
}: {
  userId: string;
  afterDate: Date;
}): Promise<RawWorkItemWithCaseAndDocketEntryInfo[]> => {
  const workItems: WorkItemWithCaseInfoKysely[] = await getDbReader(reader => {
    return workItemQCQueryBase(reader)
      .where('w.assigneeId', '=', userId)
      .where('w.completedAt', '>=', afterDate)
      .execute();
  });

  return await attachDocketEntriesToWorkItemQC({ workItems });
};
