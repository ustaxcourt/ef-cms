import {
  DOCKET_SECTION,
  PETITIONS_SECTION,
} from '@shared/business/entities/EntityConstants';
import { getDbReader } from '@web-api/database';
import {
  attachDocketEntriesToWorkItemQC,
  workItemQCQueryBase,
} from '@web-api/persistence/postgres/workitems/getDocumentQCInboxForUser';
import {
  RawWorkItemWithCaseAndDocketEntryInfo,
  WorkItemWithCaseInfoKysely,
} from '@web-api/persistence/postgres/workitems/schema';
import { groupBy } from 'lodash';
import { settlePromises } from '@web-api/utilities/settlePromises';

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

  let items = await attachDocketEntriesToWorkItemQC({ workItems });

  if (judgeId) {
    const groupedItems = groupBy(items, 'docketEntryId');

    const params: Set<{
      docketNumber: string;
      docketEntryId: string;
    }> = new Set();

    for (const itemGroup of Object.values(groupedItems)) {
      let missingDocketNumbers = itemGroup[0].docketEntry.multiDocketedOn;

      itemGroup.forEach(item => {
        missingDocketNumbers = missingDocketNumbers.filter(
          dn => dn !== item.docketNumber,
        );
      });

      missingDocketNumbers.forEach(dn => {
        params.add({
          docketNumber: dn,
          docketEntryId: itemGroup[0].docketEntryId,
        });
      });
    }

    const promises: Promise<any>[] = [];

    for (const param of params) {
      promises.push(getMissingItems(param));
    }

    const missingWorkItems = await settlePromises(promises);

    const missingItems = await attachDocketEntriesToWorkItemQC({
      workItems: missingWorkItems,
    });

    items = items.concat(missingItems);
  }
  return items;
};

const getMissingItems = async ({ docketNumber, docketEntryId }) => {
  const result = await getDbReader(reader => {
    return workItemQCQueryBase(reader)
      .where('w.docketNumber', '=', docketNumber)
      .where('w.docketEntryId', '=', docketEntryId)
      .limit(5000)
      .executeTakeFirst();
  });
  return result;
};
