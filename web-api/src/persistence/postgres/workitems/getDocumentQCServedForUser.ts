import { getDbReader } from '@web-api/database';
import { fromKyselyWorkItemAndCase } from '@web-api/persistence/postgres/workitems/mapper';
import {
  workItemQCQueryBase,
  WorkItemWithCaseInfo,
} from '@web-api/persistence/postgres/workitems/getDocumentQCInboxForUser';

export const getDocumentQCServedForUser = async ({
  afterDate,
  userId,
}: {
  userId: string;
  afterDate: Date;
}): Promise<WorkItemWithCaseInfo[]> => {
  const workItems = await getDbReader(reader => {
    return workItemQCQueryBase(reader)
      .where('w.assigneeId', '=', userId)
      .where('w.completedAt', '>=', afterDate)
      .execute();
  });

  return workItems.map(fromKyselyWorkItemAndCase);
};
