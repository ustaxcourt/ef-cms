import { Case } from '@shared/business/entities/cases/Case';
import { WorkItem } from '@shared/business/entities/WorkItem';
import { getDbReader } from '@web-api/database';
import { transformNullToUndefined } from '@web-api/persistence/postgres/utils/transformNullToUndefined';
import { WorkItemWithCaseInfo } from '@web-api/persistence/postgres/workitems/getDocumentQCInboxForUser';

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
        'c.status as caseStatus',
        'c.caption',
        'c.leadDocketNumber',
        'c.trialDate',
        'c.trialLocation',
      ])
      .selectAll('w')
      .execute();
  });

  return workItems.map(workItem => {
    const abomination: WorkItemWithCaseInfo = {
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
    };
    return transformNullToUndefined(abomination);
  });
};
