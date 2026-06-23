import { Case } from '@shared/business/entities/cases/Case';
import {
  ADVANCED_CASE_SEARCH_PAGE_SIZE,
  ASCENDING,
  DESCENDING,
  MAX_CASE_SEARCH_RESULTS,
} from '@shared/business/entities/EntityConstants';
import { dateStringsCompared } from '@shared/business/utilities/DateHandler';
import { type ClientApplicationContext } from '@web-client/applicationContext';
import { getFullStateName } from './getFullStateName';

export const DEFAULT_CASE_SEARCH_SORT: CaseSearchSort = {
  sortColumn: 'resultIndex',
  sortDirection: ASCENDING,
};

export type CaseSearchSortDirection = typeof ASCENDING | typeof DESCENDING;

export type CaseSearchSort = {
  sortColumn: string;
  sortDirection: CaseSearchSortDirection;
};

export type CaseSearchSortOption = {
  label: string;
  value: string;
};

type CaseSearchPetitioner = {
  contactId: string;
  state?: string;
};

type FormattedCaseSearchPetitionerState = {
  contactId: string;
  state: string | undefined;
};

type CaseSearchResultValue =
  | CaseSearchPetitioner[]
  | FormattedCaseSearchPetitionerState[]
  | number
  | string
  | (string | undefined)[]
  | undefined;

export type CaseSearchResult = {
  [key: string]: CaseSearchResultValue;
  caseCaption?: string;
  docketNumber?: string;
  docketNumberWithSuffix?: string;
  petitionerNames?: string[];
  petitionerStateNames?: (string | undefined)[];
  petitioners?: CaseSearchPetitioner[];
  receivedAt?: string;
};

type FormattedCaseSearchResultWithoutIndex = CaseSearchResult & {
  caseTitle: string;
  docketNumber: string;
  formattedFiledDate: string;
  petitionerFullStateNames?: FormattedCaseSearchPetitionerState[];
  petitionerNames: string[];
  petitionerStateNames: string[];
};

export type FormattedCaseSearchResult =
  FormattedCaseSearchResultWithoutIndex & {
    resultIndex: number;
  };

export type AdvancedCaseSearchHelperResult = {
  caseSearchMobileSortValue: string;
  caseSearchSortColumnForDisplay: string;
  caseSearchSortDirectionForDisplay: CaseSearchSortDirection;
  formattedSearchResults: FormattedCaseSearchResult[];
  numberOfResults: number;
  showManyResultsMessage: boolean;
  showNoMatches: boolean;
  showSearchResults: boolean;
  sortOptions: CaseSearchSortOption[];
  totalPages: number;
};

export const CASE_SEARCH_SORT_OPTIONS: CaseSearchSortOption[] = [
  { label: 'Sort by No. (ascending)', value: `resultIndex|${ASCENDING}` },
  {
    label: 'Sort by No. (descending)',
    value: `resultIndex|${DESCENDING}`,
  },
  {
    label: 'Sort by Petitioner(s) (ascending)',
    value: `petitionerNames|${ASCENDING}`,
  },
  {
    label: 'Sort by Petitioner(s) (descending)',
    value: `petitionerNames|${DESCENDING}`,
  },
  {
    label: 'Sort by Docket No. (ascending)',
    value: `docketNumber|${ASCENDING}`,
  },
  {
    label: 'Sort by Docket No. (descending)',
    value: `docketNumber|${DESCENDING}`,
  },
  {
    label: 'Sort by Newest',
    value: `receivedAt|${DESCENDING}`,
  },
  { label: 'Sort by Oldest', value: `receivedAt|${ASCENDING}` },
  { label: 'Sort by Case Title (ascending)', value: `caseTitle|${ASCENDING}` },
  {
    label: 'Sort by Case Title (descending)',
    value: `caseTitle|${DESCENDING}`,
  },
  {
    label: 'Sort by State (ascending)',
    value: `petitionerStateNames|${ASCENDING}`,
  },
  {
    label: 'Sort by State (descending)',
    value: `petitionerStateNames|${DESCENDING}`,
  },
];

export const advancedCaseSearchHelper = ({
  applicationContext,
  caseCurrentPaginationPage,
  caseSearchSort,
  searchResults,
}: {
  applicationContext: ClientApplicationContext;
  caseCurrentPaginationPage: number;
  caseSearchSort: CaseSearchSort;
  searchResults?: CaseSearchResult[];
}): AdvancedCaseSearchHelperResult => {
  if (!searchResults) {
    return getDefaultAdvancedCaseSearchHelperResult(caseSearchSort);
  }

  const formattedSearchResults = formatCaseSearchResultRecords({
    applicationContext,
    searchResults,
    sortColumn: caseSearchSort.sortColumn,
    sortDirection: caseSearchSort.sortDirection,
  });
  const totalPages = Math.ceil(
    formattedSearchResults.length / ADVANCED_CASE_SEARCH_PAGE_SIZE,
  );
  const firstResultIndex =
    caseCurrentPaginationPage * ADVANCED_CASE_SEARCH_PAGE_SIZE;
  const paginatedResults = formattedSearchResults.slice(
    firstResultIndex,
    firstResultIndex + ADVANCED_CASE_SEARCH_PAGE_SIZE,
  );

  return {
    ...getDefaultAdvancedCaseSearchHelperResult(caseSearchSort),
    formattedSearchResults: paginatedResults,
    numberOfResults: formattedSearchResults.length,
    showManyResultsMessage:
      formattedSearchResults.length >= MAX_CASE_SEARCH_RESULTS,
    showNoMatches: formattedSearchResults.length === 0,
    showSearchResults: formattedSearchResults.length > 0,
    totalPages,
  };
};

const getDefaultAdvancedCaseSearchHelperResult = (
  caseSearchSort: CaseSearchSort,
): AdvancedCaseSearchHelperResult => ({
  caseSearchMobileSortValue: `${caseSearchSort.sortColumn}|${caseSearchSort.sortDirection}`,
  caseSearchSortColumnForDisplay: caseSearchSort.sortColumn,
  caseSearchSortDirectionForDisplay: caseSearchSort.sortDirection,
  formattedSearchResults: [],
  numberOfResults: 0,
  showManyResultsMessage: false,
  showNoMatches: false,
  showSearchResults: false,
  sortOptions: CASE_SEARCH_SORT_OPTIONS,
  totalPages: 0,
});

const formatCaseSearchResultRecords = ({
  applicationContext,
  searchResults,
  sortColumn,
  sortDirection,
}: {
  applicationContext: ClientApplicationContext;
  searchResults: CaseSearchResult[];
  sortColumn: string;
  sortDirection: CaseSearchSortDirection;
}): FormattedCaseSearchResult[] => {
  const formattedResults: FormattedCaseSearchResult[] = searchResults.map(
    (searchResult, index): FormattedCaseSearchResult => ({
      ...formatCaseSearchResultRecord(searchResult, { applicationContext }),
      resultIndex: index + 1,
    }),
  );

  return formattedResults.sort((a, b): number => {
    const direction = sortDirection === ASCENDING ? 1 : -1;

    if (sortColumn === 'resultIndex') {
      return (a.resultIndex - b.resultIndex) * direction;
    }

    if (sortColumn === 'docketNumber') {
      return Case.docketNumberSort(a.docketNumber, b.docketNumber) * direction;
    }

    if (sortColumn === 'receivedAt') {
      const aDate = a.receivedAt;
      const bDate = b.receivedAt;

      if (!aDate && !bDate) return 0;
      if (!aDate) return 1;
      if (!bDate) return -1;

      return dateStringsCompared(aDate, bDate) * direction;
    }

    const aValue = getSortValue(a, sortColumn);
    const bValue = getSortValue(b, sortColumn);

    if (sortColumn === 'petitionerStateNames') {
      if (!aValue && !bValue) return 0;
      if (!aValue) return 1;
      if (!bValue) return -1;
    }

    return aValue.localeCompare(bValue) * direction;
  });
};

const formatCaseSearchResultRecord = (
  result: CaseSearchResult,
  { applicationContext }: { applicationContext: ClientApplicationContext },
): FormattedCaseSearchResultWithoutIndex => {
  return {
    ...result,
    caseTitle: applicationContext.getCaseTitle(result.caseCaption || ''),
    docketNumber: result.docketNumber || '',
    formattedFiledDate: applicationContext
      .getUtilities()
      .formatDateString(result.receivedAt, 'MMDDYY'),
    petitionerFullStateNames: result.petitioners?.map(
      (petitioner): FormattedCaseSearchPetitionerState => {
        return {
          contactId: petitioner.contactId,
          state: getFullStateName(petitioner.state),
        };
      },
    ),
    petitionerNames: result.petitionerNames || [],
    petitionerStateNames: removeBlankStateNames(result.petitionerStateNames),
  };
};

const getSortValue = (
  result: FormattedCaseSearchResult,
  sortColumn: string,
): string => {
  if (sortColumn === 'petitionerNames') {
    return result.petitionerNames?.join(' ')?.toLowerCase() || '';
  }

  if (sortColumn === 'petitionerStateNames') {
    return result.petitionerStateNames?.join(' ')?.toLowerCase() || '';
  }

  return result[sortColumn]?.toString().toLowerCase() || '';
};

const removeBlankStateNames = (
  petitionerStateNames: (string | undefined)[] | undefined,
): string[] => {
  return (
    petitionerStateNames?.filter(
      (petitionerStateName): petitionerStateName is string =>
        !!petitionerStateName,
    ) || []
  );
};
