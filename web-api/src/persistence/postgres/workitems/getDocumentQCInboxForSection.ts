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
import { groupBy } from 'lodash';

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

  // get work items for entire consolidated group of cases if judge is not assigned on every case in the group
  if (judgeId) {
    const groupedItems = groupBy(items, 'docketEntryId');

    const params = new Set<string>();

    for (const itemGroup of Object.values(groupedItems)) {
      let missingDocketNumbers = itemGroup[0].docketEntry.multiDocketedOn || [];

      itemGroup.forEach(item => {
        missingDocketNumbers = missingDocketNumbers.filter(
          dn => dn !== item.docketNumber,
        );
      });

      missingDocketNumbers.forEach(dn => {
        params.add(`${dn}|${itemGroup[0].docketEntryId}`);
      });
    }

    const pairs: { docketNumber: string; docketEntryId: string }[] = [];

    for (const param of params) {
      const [docketNumber, docketEntryId] = param.split('|');
      pairs.push({ docketNumber, docketEntryId });
    }

    const missingWorkItems = await getMissingItems(pairs);

    const missingItems = await attachDocketEntriesToWorkItemQC({
      workItems: missingWorkItems,
    });

    items = items.concat(missingItems);
  }
  return items;
};

const getMissingItems = async pairs => {
  const result = await getDbReader(reader => {
    return workItemQCQueryBase(reader)
      .where(qb =>
        qb.or(
          pairs.map(pair =>
            qb.and([
              qb('w.docketEntryId', '=', pair.docketEntryId),
              qb('w.docketNumber', '=', pair.docketNumber),
            ]),
          ),
        ),
      )
      .execute();
  });
  return result;
};
