import {
  CaseRecord,
  IrsPractitionerOnCaseRecord,
  PrivatePractitionerOnCaseRecord,
  TDynamoRecord,
} from '@web-api/persistence/dynamo/dynamoTypes';
import {
  ConsolidatedCaseSummary,
  RawConsolidatedCaseSummary,
} from '@shared/business/dto/cases/ConsolidatedCaseSummary';
import { sortBy } from 'lodash';

export const getAssociatedJudge = (theCase, caseAndCaseItems) => {
  if (theCase && theCase.judgeUserId) {
    const associatedJudgeId = caseAndCaseItems.find(
      item => item.sk === `user|${theCase.judgeUserId}`,
    );
    return associatedJudgeId ? associatedJudgeId.name : undefined;
  } else if (theCase && theCase.associatedJudge) {
    return theCase.associatedJudge;
  }
};

export const isArchivedCorrespondenceItem = item =>
  item.sk.startsWith('correspondence|') && item.archived;

export const isArchivedDocketEntryItem = item =>
  item.sk.startsWith('docket-entry|') && item.archived;

export const isCaseItem = (item: any): item is CaseRecord =>
  item.pk?.startsWith('case|') && item.sk.startsWith('case|');

export const isCorrespondenceItem = item =>
  item.sk.startsWith('correspondence|') && !item.archived;

export const isDocketEntryItem = item =>
  item.sk.startsWith('docket-entry|') && !item.archived;

export const isWorkItemItem = item => item.sk.startsWith('work-item|');

export const isHearingItem = item => item.sk.startsWith('hearing|');

export const isIrsPractitionerItem = (
  item: any,
): item is IrsPractitionerOnCaseRecord =>
  item.pk?.startsWith('case|') && item.sk?.startsWith('irsPractitioner|');

export const isPrivatePractitionerItem = (
  item: any,
): item is PrivatePractitionerOnCaseRecord =>
  item.pk?.startsWith('case|') && item.sk.startsWith('privatePractitioner|');

export const aggregateCaseItems = (caseAndCaseItems): RawCase => {
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

export const aggregateConsolidatedCaseItems = (
  consolidatedCaseItems: TDynamoRecord<
    IrsPractitionerOnCaseRecord | PrivatePractitionerOnCaseRecord | CaseRecord
  >[],
): RawConsolidatedCaseSummary[] => {
  const caseMap: Map<string, RawConsolidatedCaseSummary> = new Map();
  consolidatedCaseItems
    .filter((item): item is CaseRecord => isCaseItem(item))
    .forEach(item =>
      caseMap.set(item.pk, new ConsolidatedCaseSummary(item).toRawObject()),
    );

  consolidatedCaseItems.forEach(item => {
    if (isIrsPractitionerItem(item)) {
      caseMap.get(item.pk)?.irsPractitioners.push(item);
    }
    if (isPrivatePractitionerItem(item)) {
      caseMap.get(item.pk)?.privatePractitioners.push(item);
    }
  });

  return [...caseMap.values()];
};
