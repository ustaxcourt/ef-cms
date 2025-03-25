import { WorkItem } from '@shared/business/entities/WorkItem';
import { getDbReader } from '@web-api/database';
import { workItemEntity } from '@web-api/persistence/postgres/workitems/mapper';

export const getDocumentQCInboxForSection = async ({
  judgeUserName,
  section,
}: {
  judgeUserName?: string;
  section: string;
}): Promise<WorkItem[] | undefined> => {
  const workItems = await getDbReader(reader => {
    let builder = reader
      .selectFrom('dwWorkItem as w')
      .where('w.section', '=', section)
      .where('w.completedAt', 'is', null)
      .leftJoin('dwCase as c', 'c.docketNumber', 'w.docketNumber')
      .orderBy('w.highPriority', 'desc')
      .limit(5000);

    if (judgeUserName) {
      builder = builder.where('w.associatedJudge', '=', judgeUserName);
    }

    return builder
      .selectAll('w')
      .select(['c.caption', 'c.status'])
      .select(['w.docketNumber', 'w.highPriority', 'c.trialDate'])
      .execute();
  });

  return workItems.map(workItem => workItemEntity(workItem));
};
