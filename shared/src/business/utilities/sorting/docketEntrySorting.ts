import { DocketEntry } from '@shared/business/entities/DocketEntry';
import { calculateDifferenceInDays } from '@shared/business/utilities/DateHandler';

type DocketEntrySortFields = 'index' | 'filingDate';

export const sortDocketEntries = (
  docketEntries: (RawDocketEntry & {
    createdAtFormatted: string | undefined;
  })[] = [],
  sortByField?: DocketEntrySortFields,
  ascending: boolean = true,
) => {
  // Get the comparison function we want to use, reverse if descending, and sort.
  let comparator = getDocketEntryComparator(sortByField);
  if (!ascending) {
    comparator = (a, b) => -1 * getDocketEntryComparator(sortByField)(a, b);
  }
  return docketEntries.sort(comparator);
};

const getDocketEntryComparator = (
  fieldToSortBy: DocketEntrySortFields = 'filingDate',
): ((a: DocketEntry, b: DocketEntry) => number) => {
  const fieldToComparatorMapping: Record<
    DocketEntrySortFields,
    (a: DocketEntry, b: DocketEntry) => number
  > = {
    filingDate: byDocketEntryFilingDateComparator,
    index: byDocketEntryIndexComparator,
  };

  const baseComparator = fieldToComparatorMapping[fieldToSortBy];
  if (!baseComparator) {
    throw new Error(`Unsupported fieldToSortBy: ${fieldToSortBy}`);
  }

  return (a: DocketEntry, b: DocketEntry) => {
    const undefinedComparison = byCreatedAtExistsComparator(a, b);
    if (undefinedComparison !== 0) {
      return undefinedComparison;
    }

    return baseComparator(a, b);
  };
};

const byDocketEntryFilingDateComparator = (a: DocketEntry, b: DocketEntry) => {
  const compared = calculateDifferenceInDays(a.filingDate, b.filingDate);
  if (compared === 0) {
    return byDocketEntryIndexComparator(a, b);
  }
  return compared;
};

const byDocketEntryIndexComparator = (a, b) => {
  if (!a.index && !b.index) {
    return 0;
  } else if (!a.index) {
    return 1;
  } else if (!b.index) {
    return -1;
  }
  return a.index - b.index;
};

const byCreatedAtExistsComparator = (
  a: { createdAtFormatted: string },
  b: { createdAtFormatted: string },
): number => {
  if (a.createdAtFormatted && !b.createdAtFormatted) {
    return -1;
  }
  if (!a.createdAtFormatted && b.createdAtFormatted) {
    return 1;
  }
  return 0;
};
