import {
  DOCKET_SECTION,
  PETITIONS_SECTION,
} from '@shared/business/entities/EntityConstants';
import { getDbReader } from '@web-api/database';
import { WorkItemWithCaseInfo } from '@web-api/persistence/postgres/workitems/getDocumentQCInboxForUser';
import { toWorkItemWithCaseInfo } from '@web-api/persistence/postgres/workitems/mapper';

export const getDocumentQCInboxForSection = async ({
  judgeId,
  section,
}: {
  judgeId?: string | null;
  section: typeof PETITIONS_SECTION | typeof DOCKET_SECTION;
}): Promise<WorkItemWithCaseInfo[]> => {
  const workItems = await getDbReader(reader => {
    let builder = reader
      .selectFrom('dwWorkItem as w')
      .where('w.section', '=', section)
      .where('w.completedAt', 'is', null)
      .leftJoin('dwCase as c', 'c.docketNumber', 'w.docketNumber')
      .limit(5000);

    if (judgeId) {
      builder = builder.where('c.associatedJudgeId', '=', judgeId);
    } else if (judgeId === null) {
      builder = builder.where('c.associatedJudgeId', 'is', null);
    }

    return builder
      .selectAll('w')
      .select([
        'c.status',
        'c.caption',
        'c.leadDocketNumber',
        'c.trialDate',
        'c.trialLocation',
      ])
      .execute();
  });

  return workItems.map(toWorkItemWithCaseInfo);
};
