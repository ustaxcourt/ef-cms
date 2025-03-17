import { Case } from '@shared/business/entities/cases/Case';
import { WorkItem } from '@shared/business/entities/WorkItem';
import { getDbReader } from '@web-api/database';
import { transformNullToUndefined } from '@web-api/persistence/postgres/utils/transformNullToUndefined';
import { WorkItemAbomination } from '@web-api/persistence/postgres/workitems/getDocumentQCInboxForUser';

export const getDocumentQCInboxForSection = async ({
  judgeUserName,
  section,
}: {
  judgeUserName?: string;
  section: string;
}): Promise<WorkItemAbomination[]> => {
  const workItems = await getDbReader(reader => {
    let builder = reader
      .selectFrom('dwWorkItem as w')
      .where('w.section', '=', section)
      .where('w.completedAt', 'is', null)
      .leftJoin('dwCase as c', 'c.docketNumber', 'w.docketNumber')
      .orderBy('w.highPriority', 'desc')
      .limit(5000);

    if (judgeUserName) {
      builder = builder.where('c.associatedJudge', '=', judgeUserName);
    }

    return builder
      .selectAll('w')
      .select([
        'c.status as caseStatus',
        'c.caption',
        'c.leadDocketNumber',
        'c.trialDate',
        'c.trialLocation',
        'c.highPriority',
      ])
      .execute();
  });

  return workItems.map(workItem => {
    const abomination: WorkItemAbomination = {
      ...new WorkItem({
        ...workItem,
        completedAt: workItem.completedAt?.toISOString(),
        createdAt: workItem.createdAt?.toISOString(),
        updatedAt: workItem.createdAt?.toISOString(),
      }).toRawObject(),
      caseTitle: Case.getCaseTitle(workItem.caption),
      caseStatus: workItem.caseStatus || undefined,
      leadDocketNumber: workItem?.leadDocketNumber || undefined,
      trialDate: workItem?.trialDate?.toISOString(),
      trialLocation: workItem?.trialLocation || undefined,
      highPriority: workItem?.highPriority,
    };
    return transformNullToUndefined(abomination);
  });
};
