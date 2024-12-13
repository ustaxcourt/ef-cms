import { calculateDifferenceInDays } from '@shared/business/utilities/DateHandler';

export const DOCKET_ENTRY_SORT_FIELDS = {
  filingDate: 'filingDate',
  index: 'index',
} as const;

export type DocketEntrySortField =
  (typeof DOCKET_ENTRY_SORT_FIELDS)[keyof typeof DOCKET_ENTRY_SORT_FIELDS];

export type DocketRecordSortInfo = {
  sortByField: DocketEntrySortField;
  ascending: boolean;
};

type Comparator<T> = (a: T, b: T) => number;

// This specifies the minimum fields we need to sort by
type SortableDocketEntry = {
  index: number;
  filingDate: string;
  createdAtFormatted?: string;
  [key: string]: unknown;
};

export const sortDocketEntries = <T extends SortableDocketEntry>({
  ascending = true,
  docketEntries = [],
  sortByField = DOCKET_ENTRY_SORT_FIELDS.filingDate,
}: {
  docketEntries: T[];
  sortByField?: DocketEntrySortField;
  ascending?: boolean;
}): T[] => {
  // Get the comparison function to use, then sort using it
  const comparator = createDocketEntryComparator(sortByField, ascending);
  return docketEntries.sort(comparator);
};

const createDocketEntryComparator = (
  fieldToSortBy: DocketEntrySortField,
  ascending: boolean,
): ((a: SortableDocketEntry, b: SortableDocketEntry) => number) => {
  const fieldComparators: Record<
    DocketEntrySortField,
    Comparator<SortableDocketEntry>
  > = {
    filingDate: compareByFilingDate,
    index: compareByIndex,
  };

  const fieldToSortByComparator = fieldComparators[fieldToSortBy];
  if (!fieldToSortByComparator) {
    throw new Error(`Unsupported fieldToSortBy: ${fieldToSortBy}`);
  }

  return (a, b) => {
    // We group all entries without createdAtFormatted together, so do that comparison first.
    // If it doesn't apply, continue to compare using the fieldToSortBy.
    let comparisonResult = compareByCreatedAtExists(a, b);
    if (comparisonResult === 0) {
      comparisonResult = fieldToSortByComparator(a, b);
    }

    return ascending ? comparisonResult : -1 * comparisonResult;
  };
};

const compareByFilingDate: Comparator<SortableDocketEntry> = (a, b) => {
  const dateComparison = calculateDifferenceInDays(a.filingDate, b.filingDate);
  return dateComparison !== 0 ? dateComparison : compareByIndex(a, b);
};

const compareByIndex: Comparator<SortableDocketEntry> = (a, b) => {
  if (a.index === undefined && b.index === undefined) return 0;
  if (a.index === undefined) return 1;
  if (b.index === undefined) return -1;
  return a.index - b.index;
};

const compareByCreatedAtExists: Comparator<{
  createdAtFormatted?: string;
}> = (a, b) => {
  if (a.createdAtFormatted && !b.createdAtFormatted) return 1;
  if (!a.createdAtFormatted && b.createdAtFormatted) return -1;
  return 0;
};
