import { RawWorkItem, WorkItem } from '@shared/business/entities/WorkItem';
import { getDbWriter } from '@web-api/database';
import { isEmpty } from 'lodash';
import { toKyselyNewWorkItem } from './mapper';

export const upsertWorkItems = async ({
  workItems,
}: {
  workItems: RawWorkItem[];
}): Promise<RawWorkItem[]> => {
  if (isEmpty(workItems)) {
    return [];
  }

  const createdWorkItems = await getDbWriter(writer =>
    writer
      .insertInto('dwWorkItem')
      .values(workItems.map(w => toKyselyNewWorkItem(w)))
      .onConflict(oc =>
        oc.column('workItemId').doUpdateSet(c => {
          return {
            assigneeId: c.ref('excluded.assigneeId'),
            assigneeName: c.ref('excluded.assigneeName'),
            associatedJudge: c.ref('excluded.associatedJudge'),
            associatedJudgeId: c.ref('excluded.associatedJudgeId'),
            caseIsInProgress: c.ref('excluded.caseIsInProgress'),
            completedAt: c.ref('excluded.completedAt'),
            completedBy: c.ref('excluded.completedBy'),
            completedByUserId: c.ref('excluded.completedByUserId'),
            completedMessage: c.ref('excluded.completedMessage'),
            createdAt: c.ref('excluded.createdAt'),
            docketEntry: c.ref('excluded.docketEntry'),
            docketNumber: c.ref('excluded.docketNumber'),
            hideFromPendingMessages: c.ref('excluded.hideFromPendingMessages'),
            highPriority: c.ref('excluded.highPriority'),
            inProgress: c.ref('excluded.inProgress'),
            isInitializeCase: c.ref('excluded.isInitializeCase'),
            isRead: c.ref('excluded.isRead'),
            section: c.ref('excluded.section'),
            sentBy: c.ref('excluded.sentBy'),
            sentBySection: c.ref('excluded.sentBySection'),
            sentByUserId: c.ref('excluded.sentByUserId'),
            updatedAt: c.ref('excluded.updatedAt'),
          };
        }),
      )
      .returningAll()
      .execute(),
  );

  if (!createdWorkItems) {
    throw new Error('could not upsert work items');
  }

  return createdWorkItems.map(w => new WorkItem(w));
};
