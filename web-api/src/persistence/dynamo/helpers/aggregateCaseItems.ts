import {
  CaseRecord,
  IrsPractitionerOnCaseRecord,
  PrivatePractitionerOnCaseRecord,
} from '@web-api/persistence/dynamo/dynamoTypes';
import { sortBy } from 'lodash';

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
  const archivedCorrespondences = [];
  const archivedDocketEntries = [];
  const caseRecords = [];
  const correspondences = [];
  const docketEntries = []; // documents
  const hearings = [];
  const irsPractitioners = [];
  const privatePractitioners = [];

  caseAndCaseItems.forEach(item => {
    if (isDocketEntryItem(item)) {
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
    correspondence: sortedCorrespondences,
    docketEntries: sortedDocketEntries,
    hearings,
    irsPractitioners,
    privatePractitioners,
  };
};
