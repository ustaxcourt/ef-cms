import { RawCorrespondence } from '@shared/business/entities/Correspondence';
import { DocketEntry } from '@shared/business/entities/DocketEntry';
import {
  IrsPractitionerOnCaseRecord,
  PrivatePractitionerOnCaseRecord,
} from '@web-api/persistence/dynamo/dynamoTypes';
import { sortBy } from 'lodash';

export const isArchivedCorrespondenceItem = (
  item: any,
): item is RawCorrespondence =>
  item.sk.startsWith('correspondence|') && item.archived;

export const isArchivedDocketEntryItem = (item: any): item is DocketEntry =>
  item.sk.startsWith('docket-entry|') && item.archived;

export const isCaseItem = (item: any): item is RawCase =>
  item.pk?.startsWith('case|') && item.sk.startsWith('case|');

export const isCorrespondenceItem = (item: any): item is RawCorrespondence =>
  item.sk.startsWith('correspondence|') && !item.archived;

export const isDocketEntryItem = (item: any): item is DocketEntry =>
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
  const archivedCorrespondences: RawCorrespondence[] = [];
  const archivedDocketEntries: DocketEntry[] = [];
  const caseRecords: RawCase[] = [];
  const correspondences: RawCorrespondence[] = [];
  const docketEntries: DocketEntry[] = []; // documents
  const hearings: any[] = [];
  const irsPractitioners: any = [];
  const privatePractitioners: any = [];

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

  const theCase = caseRecords.pop()!;

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
