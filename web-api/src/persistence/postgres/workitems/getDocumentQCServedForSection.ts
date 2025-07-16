import {
  DOCKET_SECTION,
  PETITIONS_SECTION,
} from '@shared/business/entities/EntityConstants';
import { getDbReader } from '@web-api/database';
import { fromKyselyWorkItemAndCase } from '@web-api/persistence/postgres/workitems/mapper';
import {
  workItemQCQueryBase,
  WorkItemWithCaseInfo,
} from '@web-api/persistence/postgres/workitems/getDocumentQCInboxForUser';

export const getDocumentQCServedForSection = async ({
  afterDate,
  section,
}: {
  section: typeof DOCKET_SECTION | typeof PETITIONS_SECTION;
  afterDate: Date;
}): Promise<WorkItemWithCaseInfo[]> => {
  const workItems = await getDbReader(reader => {
    return workItemQCQueryBase(reader)
      .where('w.section', '=', section)
      .where('w.completedAt', '>=', afterDate)
      .execute();
  });

  return workItems.map(fromKyselyWorkItemAndCase);
};
