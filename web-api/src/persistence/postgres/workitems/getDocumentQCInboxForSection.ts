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

  const maybeComplete = await attachDocketEntriesToWorkItemQC({ workItems });
  // return maybeComplete;

  // temp results to calculate and query what else we need and push maybe complete
  const temp = {};

  // loop over maybe complete, key by docket entry id, value is every item in maybe complete array that shares the docket entry ID
  for (const de of maybeComplete) {
    if (temp[de.docketEntryId]) {
      temp[de.docketEntryId].push(de);
    } else {
      temp[de.docketEntryId] = [de];
    }
  }

  const anotherTemp = [];

  for (const deArray of Object.values(temp)) {
    const multiDocketedForGroup = deArray[0].docketEntry.multiDocketedOn;

    const { docketEntryId } = deArray[0];

    for (const el of deArray) {
      multiDocketedForGroup.filter(mlEL => mlEL !== el.docketNumber);
    }

    multiDocketedForGroup.forEach(el =>
      anotherTemp.push({
        docketNumber: el.docketNumber,
        docketEntryId,
      }),
    );
  }

  // loop over the items in array of key by docket entry ID
  // pick out MD array, compare length of array that is in there
  // for each docket number in MD array, is there an item that is key by docket entry ID, if no, no then yes
};
