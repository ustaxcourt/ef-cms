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
      .selectFrom('workItem as w')
      .leftJoin('case as c', 'c.docketNumber', 'w.docketNumber')
      .where('w.section', '=', section);

    if (judgeUserName) {
      builder = builder.where('w.associatedJudge', '=', judgeUserName);
    }

    return builder.selectAll().select('w.docketNumber').execute();
  });

  return workItems.map(workItem => workItemEntity(workItem));
};
