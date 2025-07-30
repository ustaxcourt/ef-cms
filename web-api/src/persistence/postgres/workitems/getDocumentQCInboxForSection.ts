import {
  DOCKET_SECTION,
  PETITIONS_SECTION,
} from '@shared/business/entities/EntityConstants';
import { getDbReader } from '@web-api/persistence/postgres/database';
import {
  attachDocketEntriesToWorkItemQC,
  workItemQCQueryBase,
} from '@web-api/persistence/postgres/workitems/getDocumentQCInboxForUser';
import {
  RawWorkItemWithCaseAndDocketEntryInfo,
  WorkItemWithCaseInfoKysely,
} from '@web-api/persistence/postgres/workitems/schema';

export const getDocumentQCInboxForSection = async ({
  judgeId,
  section,
}: {
  judgeId?: string | null;
  section: typeof PETITIONS_SECTION | typeof DOCKET_SECTION;
}): Promise<RawWorkItemWithCaseAndDocketEntryInfo[]> => {
  const workItems: WorkItemWithCaseInfoKysely[] = await getDbReader(reader => {
    let builder = workItemQCQueryBase(reader)
      .where('w.section', '=', section)
      .where('w.completedAt', 'is', null)
      .limit(5000);

    if (judgeId) {
      builder = builder.where('c.associatedJudgeId', '=', judgeId);
    } else if (judgeId === null) {
      builder = builder.where('c.associatedJudgeId', 'is', null);
    }

    return builder.execute();
  });

  return attachDocketEntriesToWorkItemQC({ workItems });
};
