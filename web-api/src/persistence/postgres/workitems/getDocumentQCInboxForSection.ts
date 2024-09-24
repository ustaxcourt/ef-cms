import { getDbReader } from '@web-api/database';
import { transformNullToUndefined } from '../utils/transformNullToUndefined';
import { WorkItem } from '@shared/business/entities/WorkItem';

export const getDocumentQCInboxForSection = async ({
  judgeUserName,
  section,
}: {
  judgeUserName?: string;
  section: string;
}): Promise<WorkItem[] | undefined> => {
  const workItems = await getDbReader(reader => {
    let builder = reader.selectFrom('workItem').where('section', '=', section);

    if (judgeUserName) {
      builder = builder.where('associatedJudge', '=', judgeUserName);
    }

    return builder.selectAll().execute();
  });

  return workItems.map(
    workItem => new WorkItem(transformNullToUndefined({ ...workItem })),
  );
};
