import {
  DOCKET_SECTION,
  PETITIONS_SECTION,
} from '@shared/business/entities/EntityConstants';
import { getDbReader } from '@web-api/database';
import { WorkItemWithCaseInfo } from '@web-api/persistence/postgres/workitems/getDocumentQCInboxForUser';
import { fromKyselyWorkItemAndCase } from '@web-api/persistence/postgres/workitems/mapper';

export const getDocumentQCServedForSection = async ({
  afterDate,
  section,
}: {
  section: typeof DOCKET_SECTION | typeof PETITIONS_SECTION;
  afterDate: Date;
}): Promise<WorkItemWithCaseInfo[]> => {
  const workItems = await getDbReader(reader => {
    return reader
      .selectFrom('dwWorkItem as w')
      .leftJoin('dwCase as c', 'c.docketNumber', 'w.docketNumber')
      .where('w.section', '=', section)
      .where('w.completedAt', '>=', afterDate)
      .select([
        'c.status',
        'c.caption',
        'c.leadDocketNumber',
        'c.trialDate',
        'c.trialLocation',
      ])
      .selectAll('w')
      .select('w.docketNumber')
      .execute();
  });

  return workItems.map(fromKyselyWorkItemAndCase);
};
