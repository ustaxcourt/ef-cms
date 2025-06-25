import { getDbReader } from '@web-api/database';
import { WorkItemWithCaseInfo } from '@web-api/persistence/postgres/workitems/getDocumentQCInboxForUser';
import { fromKyselyWorkItemAndCase } from '@web-api/persistence/postgres/workitems/mapper';

export const getDocumentQCServedForUser = async ({
  afterDate,
  userId,
}: {
  userId: string;
  afterDate: Date;
}): Promise<WorkItemWithCaseInfo[]> => {
  const workItems = await getDbReader(reader => {
    return reader
      .selectFrom('dwWorkItem as w')
      .leftJoin('dwCase as c', 'c.docketNumber', 'w.docketNumber')
      .where('w.assigneeId', '=', userId)
      .where('w.completedAt', '>=', afterDate)
      .select([
        'c.status',
        'c.caption',
        'c.leadDocketNumber',
        'c.trialDate',
        'c.trialLocation',
      ])
      .selectAll('w')
      .execute();
  });

  return workItems.map(fromKyselyWorkItemAndCase);
};
