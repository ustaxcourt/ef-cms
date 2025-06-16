import {
  CaseStatus,
  DOCKET_SECTION,
  PETITIONS_SECTION,
} from '@shared/business/entities/EntityConstants';
import { getDbReader } from '@web-api/database';
import { WorkItemWithCaseInfo } from '@web-api/persistence/postgres/workitems/getDocumentQCInboxForUser';
import { toWorkItemWithCaseInfo } from '@web-api/persistence/postgres/workitems/mapper';

// 10680 TODO: consolidate all work item queries into one function
export const getWorkItems = async ({
  assigneeId,
  caseStatus,
  completedAfter,
  completedByUserId,
  inProgress,
  judgeId,
  section,
}: {
  assigneeId?: string;
  caseStatus?: CaseStatus | null;
  completedAfter: Date | null;
  completedByUserId?: string | null;
  inProgress?: boolean | null;
  judgeId?: string | null;
  section?: typeof PETITIONS_SECTION | typeof DOCKET_SECTION;
}): Promise<WorkItemWithCaseInfo[]> => {
  const workItems = await getDbReader(reader => {
    let builder = reader
      .selectFrom('dwWorkItem as w')
      .leftJoin('dwCase as c', 'c.docketNumber', 'w.docketNumber')
      .where('w.inProgress', '=', inProgress);

    if (assigneeId) {
      builder = builder.where('w.assigneeId', '=', assigneeId);
    }

    if (caseStatus) {
      builder = builder.where('c.status', '=', caseStatus);
    }

    if (completedAfter === null) {
      builder = builder.where('w.completedAt', 'is', null);
    } else {
      builder = builder.where('w.completedAt', '>=', completedAfter);
    }

    if (completedByUserId) {
      builder = builder.where('w.completedByUserId', '=', completedByUserId);
    } else if (completedByUserId === null) {
      builder = builder.where('w.completedByUserId', 'is', null);
    }

    if (inProgress === true) {
      builder = builder.where('w.inProgress', '=', true);
    } else if (inProgress === false) {
      builder = builder.where('w.inProgress', '!=', true);
    }

    if (judgeId) {
      builder = builder.where('c.associatedJudgeId', '=', judgeId);
    } else if (judgeId === null) {
      builder = builder.where('c.associatedJudgeId', 'is', null);
    }

    if (section) {
      builder = builder.where('w.section', '=', section);
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
      .limit(5000)
      .execute();
  });

  return workItems.map(toWorkItemWithCaseInfo);
};
