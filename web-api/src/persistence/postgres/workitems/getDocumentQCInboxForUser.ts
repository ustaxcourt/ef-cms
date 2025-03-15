import { Case } from '@shared/business/entities/cases/Case';
import { RawWorkItem, WorkItem } from '@shared/business/entities/WorkItem';
import { getDbReader } from '@web-api/database';
import { transformNullToUndefined } from '@web-api/persistence/postgres/utils/transformNullToUndefined';

export const getDocumentQCInboxForUser = async ({
  userId,
}: {
  userId: string;
}): Promise<WorkItemAbomination[]> => {
  const workItems = await getDbReader(reader => {
    return reader
      .selectFrom('dwWorkItem as w')
      .where('w.assigneeId', '=', userId)
      .where('w.completedAt', 'is', null)
      .leftJoin('dwCase as c', 'c.docketNumber', 'w.docketNumber')
      .select([
        'c.status as caseStatus',
        'c.caption',
        'c.leadDocketNumber',
        'c.trialDate',
        'c.trialLocation',
      ])
      .selectAll('w')
      .limit(5000)
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
    };
    return transformNullToUndefined(abomination);
  });
};

export type WorkItemAbomination = RawWorkItem & {
  caseTitle?: string;
  caseStatus?: string;
  leadDocketNumber?: string;
  trialDate?: string;
  trialLocation?: string;
};
