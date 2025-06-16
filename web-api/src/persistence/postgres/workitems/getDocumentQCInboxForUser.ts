import { RawWorkItem } from '@shared/business/entities/WorkItem';
import { getDbReader } from '@web-api/database';
import { toWorkItemWithCaseInfo } from '@web-api/persistence/postgres/workitems/mapper';

export const getDocumentQCInboxForUser = async ({
  userId,
}: {
  userId: string;
}): Promise<WorkItemWithCaseInfo[]> => {
  const workItems = await getDbReader(reader => {
    return reader
      .selectFrom('dwWorkItem as w')
      .where('w.assigneeId', '=', userId)
      .where('w.completedAt', 'is', null)
      .leftJoin('dwCase as c', 'c.docketNumber', 'w.docketNumber')
      .select([
        'c.status',
        'c.caption',
        'c.leadDocketNumber',
        'c.trialDate',
        'c.trialLocation',
      ])
      .selectAll('w')
      .limit(5000)
      .execute();
  });

  return workItems.map(toWorkItemWithCaseInfo);
};

export type WorkItemWithCaseInfo = RawWorkItem & {
  caseTitle?: string;
  caseStatus?: string;
  leadDocketNumber?: string;
  trialDate?: string;
  trialLocation?: string;
};
