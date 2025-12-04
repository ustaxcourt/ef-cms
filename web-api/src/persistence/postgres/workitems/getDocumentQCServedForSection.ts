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

export const getDocumentQCServedForSection = async ({
  afterDate,
  section,
}: {
  section: typeof DOCKET_SECTION | typeof PETITIONS_SECTION;
  afterDate: Date;
}): Promise<RawWorkItemWithCaseAndDocketEntryInfo[]> => {
  const workItems: WorkItemWithCaseInfoKysely[] = await getDbReader(reader => {
    return workItemQCQueryBase(reader)
      .where('w.section', '=', section)
      .where('w.completedAt', '>=', afterDate)
      .execute();
  });

  return await attachDocketEntriesToWorkItemQC({ workItems });
};
