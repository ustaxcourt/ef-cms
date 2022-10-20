import { sortBy } from 'lodash';

const getAssociatedJudge = (theCase, caseAndCaseItems) => {
  if (theCase && theCase.judgeUserId) {
    const associatedJudgeId = caseAndCaseItems.find(
      item => item.sk === `user|${theCase.judgeUserId}`,
    );
    return associatedJudgeId ? associatedJudgeId.name : undefined;
  } else if (theCase && theCase.associatedJudge) {
    return theCase.associatedJudge;
  }
};

const isArchivedCorrespondenceItem = item =>
  item.sk.startsWith('correspondence|') && item.archived;

const isArchivedDocketEntryItem = item =>
  item.sk.startsWith('docket-entry|') && item.archived;

const isCaseItem = item => item.sk.startsWith('case|');

const isCorrespondenceItem = item =>
  item.sk.startsWith('correspondence|') && !item.archived;

const isDocketEntryItem = item =>
  item.sk.startsWith('docket-entry|') && !item.archived;

const isWorkItemItem = item => item.sk.startsWith('work-item|');

const isHearingItem = item => item.sk.startsWith('hearing|');

const isIrsPractitionerItem = item => item.sk.startsWith('irsPractitioner|');

const isPrivatePractitionerItem = item =>
  item.sk.startsWith('privatePractitioner|');

const aggregateCaseItems = caseAndCaseItems => {
  let archivedCorrespondences = [];
  let archivedDocketEntries = [];
  let caseRecords = [];
  let correspondences = [];
  let docketEntries = []; // documents
  let hearings = [];
  let irsPractitioners = [];
  let privatePractitioners = [];

  caseAndCaseItems.forEach(item => {
    if (isDocketEntryItem(item)) {
      // Docket Entries
      const workItem = caseAndCaseItems.find(
        caseItem =>
          isWorkItemItem(caseItem) &&
          caseItem.docketEntry.docketEntryId === item.docketEntryId,
      );
      item.workItem = workItem;
      docketEntries.push(item);
    } else if (isArchivedDocketEntryItem(item)) {
      // Archived Docket Entries
      archivedDocketEntries.push(item);
    } else if (isCorrespondenceItem(item)) {
      // Correspondences
      correspondences.push(item);
    } else if (isArchivedCorrespondenceItem(item)) {
      // Archived Correspondences
      archivedCorrespondences.push(item);
    } else if (isCaseItem(item)) {
      // Case Records
      caseRecords.push(item);
    } else if (isHearingItem(item)) {
      // Hearings
      hearings.push(item);
    } else if (isIrsPractitionerItem(item)) {
      // IRS Practitioners
      irsPractitioners.push(item);
    } else if (isPrivatePractitionerItem(item)) {
      // Private Practitioners
      privatePractitioners.push(item);
    }
  });

  const theCase = caseRecords.pop();

  const sortedDocketEntries = sortBy(docketEntries, 'createdAt');

  const sortedArchivedDocketEntries = sortBy(
    archivedDocketEntries,
    'createdAt',
  );
  const sortedCorrespondences = sortBy(correspondences, 'filingDate');

  const sortedArchivedCorrespondences = sortBy(
    archivedCorrespondences,
    'filingDate',
  );

  return {
    ...theCase,
    archivedCorrespondences: sortedArchivedCorrespondences,
    archivedDocketEntries: sortedArchivedDocketEntries,
    associatedJudge: getAssociatedJudge(theCase, caseAndCaseItems),
    correspondence: sortedCorrespondences,
    docketEntries: sortedDocketEntries,
    hearings,
    irsPractitioners,
    privatePractitioners,
  };
};

export {
  aggregateCaseItems,
  getAssociatedJudge,
  isArchivedDocketEntryItem,
  isArchivedCorrespondenceItem,
  isCaseItem,
  isCorrespondenceItem,
  isDocketEntryItem,
  isHearingItem,
  isIrsPractitionerItem,
  isPrivatePractitionerItem,
  isWorkItemItem,
};
