import {
  advancedCaseSearchHelper,
  CASE_SEARCH_SORT_OPTIONS,
  DEFAULT_CASE_SEARCH_SORT,
  type CaseSearchSort,
  type CaseSearchResult,
} from './advancedCaseSearchHelper';
import { applicationContextForClient as applicationContext } from '@web-client/test/createClientTestApplicationContext';

describe('advancedCaseSearchHelper', () => {
  const {
    ADVANCED_CASE_SEARCH_PAGE_SIZE,
    ASCENDING,
    DESCENDING,
    MAX_CASE_SEARCH_RESULTS,
  } = applicationContext.getConstants();

  const makeSearchResult = (
    overrides: CaseSearchResult = {},
  ): CaseSearchResult => ({
    caseCaption: 'Default Petitioner, Petitioner',
    docketNumber: '101-19',
    docketNumberWithSuffix: '101-19',
    petitionerNames: ['Default Petitioner'],
    petitionerStateNames: ['Tennessee'],
    receivedAt: '2019-03-01T05:00:00.000Z',
    ...overrides,
  });

  const runHelper = ({
    caseCurrentPaginationPage = 0,
    caseSearchSort = DEFAULT_CASE_SEARCH_SORT,
    searchResults,
  }: {
    caseCurrentPaginationPage?: number;
    caseSearchSort?: CaseSearchSort;
    searchResults?: CaseSearchResult[];
  }) => {
    return advancedCaseSearchHelper({
      applicationContext,
      caseCurrentPaginationPage,
      caseSearchSort,
      searchResults,
    });
  };

  it('should return default helper state when case search results are undefined', () => {
    expect(runHelper({})).toEqual({
      caseSearchMobileSortValue: `resultIndex|${ASCENDING}`,
      caseSearchSortColumnForDisplay: 'resultIndex',
      caseSearchSortDirectionForDisplay: ASCENDING,
      formattedSearchResults: [],
      numberOfResults: 0,
      showManyResultsMessage: false,
      showNoMatches: false,
      showSearchResults: false,
      sortOptions: CASE_SEARCH_SORT_OPTIONS,
      totalPages: 0,
    });
  });

  it('should format search results for display', () => {
    const result = runHelper({
      searchResults: [
        makeSearchResult({
          caseCaption: 'Test Petitioner & Another Petitioner, Petitioner(s)',
          docketNumber: '102-18',
          docketNumberWithSuffix: '102-18W',
          petitionerNames: ['Test Petitioner', 'Another Petitioner'],
          petitionerStateNames: ['TN', 'GU'],
          receivedAt: '2019-05-01T05:00:00.000Z',
        }),
      ],
    });

    expect(result.formattedSearchResults).toMatchObject([
      {
        caseTitle: 'Test Petitioner & Another Petitioner',
        docketNumber: '102-18',
        docketNumberWithSuffix: '102-18W',
        formattedFiledDate: '05/01/19',
        petitionerNames: ['Test Petitioner', 'Another Petitioner'],
        petitionerStateNames: ['Tennessee', 'Guam'],
        resultIndex: 1,
      },
    ]);
  });

  it('should default missing values, format territory names, preserve unknown states, and remove blank states', () => {
    const result = runHelper({
      searchResults: [
        {
          petitionerStateNames: [undefined, 'ZZ', 'PR'],
        },
      ],
    });

    expect(result.formattedSearchResults[0]).toMatchObject({
      caseTitle: '',
      docketNumber: '',
      formattedFiledDate: '',
      petitionerNames: [],
      petitionerStateNames: ['ZZ', 'Puerto Rico'],
    });
  });

  it('should show no matches when the search result list is empty', () => {
    expect(runHelper({ searchResults: [] })).toMatchObject({
      formattedSearchResults: [],
      numberOfResults: 0,
      showManyResultsMessage: false,
      showNoMatches: true,
      showSearchResults: false,
      totalPages: 0,
    });
  });

  it('should show the many results warning when the threshold is reached', () => {
    const searchResults = Array.from(
      { length: MAX_CASE_SEARCH_RESULTS },
      (_, index) =>
        makeSearchResult({
          docketNumber: `${index + 1}-19`,
          docketNumberWithSuffix: `${index + 1}-19`,
        }),
    );

    expect(runHelper({ searchResults }).showManyResultsMessage).toBe(true);
  });

  it('should not show the many results warning below the threshold', () => {
    expect(runHelper({ searchResults: [makeSearchResult()] })).toMatchObject({
      showManyResultsMessage: false,
    });
  });

  it('should paginate formatted search results', () => {
    const searchResults = Array.from(
      { length: ADVANCED_CASE_SEARCH_PAGE_SIZE + 1 },
      (_, index) =>
        makeSearchResult({
          caseCaption: `Petitioner ${index + 1}, Petitioner`,
          docketNumber: `${index + 1}-19`,
          docketNumberWithSuffix: `${index + 1}-19`,
          petitionerNames: [`Petitioner ${index + 1}`],
        }),
    );

    const result = runHelper({
      caseCurrentPaginationPage: 1,
      searchResults,
    });

    expect(result.totalPages).toBe(2);
    expect(result.formattedSearchResults).toHaveLength(1);
    expect(result.formattedSearchResults[0]).toMatchObject({
      caseTitle: `Petitioner ${ADVANCED_CASE_SEARCH_PAGE_SIZE + 1}`,
      resultIndex: ADVANCED_CASE_SEARCH_PAGE_SIZE + 1,
    });
  });

  it('should preserve original backend order when sorting by result index ascending', () => {
    const result = runHelper({
      caseSearchSort: {
        sortColumn: 'resultIndex',
        sortDirection: ASCENDING,
      },
      searchResults: [
        makeSearchResult({ docketNumber: '102-19' }),
        makeSearchResult({ docketNumber: '101-19' }),
      ],
    });

    expect(
      result.formattedSearchResults.map(
        searchResult => searchResult.docketNumber,
      ),
    ).toEqual(['102-19', '101-19']);
  });

  it('should sort by result index when explicitly requested', () => {
    const result = runHelper({
      caseSearchSort: {
        sortColumn: 'resultIndex',
        sortDirection: DESCENDING,
      },
      searchResults: [
        makeSearchResult({ docketNumber: '101-19' }),
        makeSearchResult({ docketNumber: '102-19' }),
      ],
    });

    expect(
      result.formattedSearchResults.map(
        searchResult => searchResult.resultIndex,
      ),
    ).toEqual([2, 1]);
  });

  it('should sort by docket number and expose the mobile sort value', () => {
    const result = runHelper({
      caseSearchSort: {
        sortColumn: 'docketNumber',
        sortDirection: ASCENDING,
      },
      searchResults: [
        makeSearchResult({ docketNumber: '102-19' }),
        makeSearchResult({ docketNumber: '101-19' }),
      ],
    });

    expect(result).toMatchObject({
      caseSearchMobileSortValue: `docketNumber|${ASCENDING}`,
      caseSearchSortColumnForDisplay: 'docketNumber',
      caseSearchSortDirectionForDisplay: ASCENDING,
    });
    expect(
      result.formattedSearchResults.map(
        searchResult => searchResult.docketNumber,
      ),
    ).toEqual(['101-19', '102-19']);
  });

  it('should sort by newest/oldest (receivedAt)', () => {
    const result = runHelper({
      caseSearchSort: {
        sortColumn: 'receivedAt',
        sortDirection: DESCENDING,
      },
      searchResults: [
        makeSearchResult({
          docketNumber: '101-19',
          receivedAt: '2019-03-01T05:00:00.000Z',
        }),
        makeSearchResult({
          docketNumber: '102-19',
          receivedAt: undefined,
        }),
        makeSearchResult({
          docketNumber: '103-19',
          receivedAt: '2020-03-01T05:00:00.000Z',
        }),
      ],
    });

    expect(
      result.formattedSearchResults.map(
        searchResult => searchResult.docketNumber,
      ),
    ).toEqual(['103-19', '101-19', '102-19']);
  });

  it('should preserve backend order when both filed dates are blank', () => {
    const result = runHelper({
      caseSearchSort: {
        sortColumn: 'receivedAt',
        sortDirection: DESCENDING,
      },
      searchResults: [
        makeSearchResult({
          docketNumber: '101-19',
          receivedAt: undefined,
        }),
        makeSearchResult({
          docketNumber: '102-19',
          receivedAt: undefined,
        }),
      ],
    });

    expect(
      result.formattedSearchResults.map(
        searchResult => searchResult.docketNumber,
      ),
    ).toEqual(['101-19', '102-19']);
  });

  it('should preserve non-blank petitioner state names while removing blank ones during formatting', () => {
    const result = runHelper({
      searchResults: [
        makeSearchResult({
          petitionerStateNames: [undefined, 'Texas'],
        }),
      ],
    });

    expect(result.formattedSearchResults[0].petitionerStateNames).toEqual([
      'Texas',
    ]);
  });

  it('should sort petitioner names alphabetically in ascending order', () => {
    const result = runHelper({
      caseSearchSort: {
        sortColumn: 'petitionerNames',
        sortDirection: ASCENDING,
      },
      searchResults: [
        makeSearchResult({
          docketNumber: '101-19',
          petitionerNames: ['Zulu Petitioner'],
        }),
        makeSearchResult({
          docketNumber: '102-19',
          petitionerNames: ['Alpha Petitioner'],
        }),
      ],
    });

    expect(
      result.formattedSearchResults.map(
        searchResult => searchResult.petitionerNames,
      ),
    ).toEqual([['Alpha Petitioner'], ['Zulu Petitioner']]);
  });

  it('should sort missing petitioner names after named petitioners when sorting descending', () => {
    const result = runHelper({
      caseSearchSort: {
        sortColumn: 'petitionerNames',
        sortDirection: DESCENDING,
      },
      searchResults: [
        makeSearchResult({
          docketNumber: '101-19',
          petitionerNames: undefined,
        }),
        makeSearchResult({
          docketNumber: '102-19',
          petitionerNames: ['Named Petitioner'],
        }),
      ],
    });

    expect(
      result.formattedSearchResults.map(
        searchResult => searchResult.docketNumber,
      ),
    ).toEqual(['102-19', '101-19']);
  });

  it('should sort petitioner state names in descending alphabetical order', () => {
    const result = runHelper({
      caseSearchSort: {
        sortColumn: 'petitionerStateNames',
        sortDirection: DESCENDING,
      },
      searchResults: [
        makeSearchResult({
          docketNumber: '101-19',
          petitionerStateNames: ['Alabama'],
        }),
        makeSearchResult({
          docketNumber: '102-19',
          petitionerStateNames: ['Wyoming'],
        }),
      ],
    });

    expect(
      result.formattedSearchResults.map(
        searchResult => searchResult.petitionerStateNames,
      ),
    ).toEqual([['Wyoming'], ['Alabama']]);
  });

  it('should sort blank petitioner state names after populated state names when ascending', () => {
    const result = runHelper({
      caseSearchSort: {
        sortColumn: 'petitionerStateNames',
        sortDirection: ASCENDING,
      },
      searchResults: [
        makeSearchResult({
          docketNumber: '101-19',
          petitionerStateNames: undefined,
        }),
        makeSearchResult({
          docketNumber: '102-19',
          petitionerStateNames: ['Texas'],
        }),
        makeSearchResult({
          docketNumber: '103-19',
          petitionerStateNames: [undefined, 'Alaska'],
        }),
      ],
    });

    expect(
      result.formattedSearchResults.map(
        searchResult => searchResult.docketNumber,
      ),
    ).toEqual(['103-19', '102-19', '101-19']);
  });

  it('should keep results with only blank petitioner state names in their original order', () => {
    const result = runHelper({
      caseSearchSort: {
        sortColumn: 'petitionerStateNames',
        sortDirection: ASCENDING,
      },
      searchResults: [
        makeSearchResult({
          docketNumber: '101-19',
          petitionerStateNames: undefined,
        }),
        makeSearchResult({
          docketNumber: '102-19',
          petitionerStateNames: undefined,
        }),
      ],
    });

    expect(
      result.formattedSearchResults.map(
        searchResult => searchResult.docketNumber,
      ),
    ).toEqual(['101-19', '102-19']);
  });

  it('should keep a blank petitioner state name after a preceding populated state name', () => {
    const result = runHelper({
      caseSearchSort: {
        sortColumn: 'petitionerStateNames',
        sortDirection: ASCENDING,
      },
      searchResults: [
        makeSearchResult({
          docketNumber: '101-19',
          petitionerStateNames: ['Texas'],
        }),
        makeSearchResult({
          docketNumber: '102-19',
          petitionerStateNames: undefined,
        }),
      ],
    });

    expect(
      result.formattedSearchResults.map(
        searchResult => searchResult.docketNumber,
      ),
    ).toEqual(['101-19', '102-19']);
  });

  it('should sort blank petitioner state names after populated state names when descending', () => {
    const result = runHelper({
      caseSearchSort: {
        sortColumn: 'petitionerStateNames',
        sortDirection: DESCENDING,
      },
      searchResults: [
        makeSearchResult({
          docketNumber: '101-19',
          petitionerStateNames: undefined,
        }),
        makeSearchResult({
          docketNumber: '102-19',
          petitionerStateNames: ['Wyoming'],
        }),
      ],
    });

    expect(
      result.formattedSearchResults.map(
        searchResult => searchResult.docketNumber,
      ),
    ).toEqual(['102-19', '101-19']);
  });

  it('should sort case titles using the generic string comparison path', () => {
    const result = runHelper({
      caseSearchSort: {
        sortColumn: 'caseTitle',
        sortDirection: DESCENDING,
      },
      searchResults: [
        makeSearchResult({
          caseCaption: 'Alpha Petitioner, Petitioner',
          docketNumber: '101-19',
        }),
        makeSearchResult({
          caseCaption: 'Zulu Petitioner, Petitioner',
          docketNumber: '102-19',
        }),
      ],
    });

    expect(
      result.formattedSearchResults.map(searchResult => searchResult.caseTitle),
    ).toEqual(['Zulu Petitioner', 'Alpha Petitioner']);
  });

  it('should handle unknown sort columns by falling back to empty-string comparisons', () => {
    const result = runHelper({
      caseSearchSort: {
        sortColumn: 'unknownColumn',
        sortDirection: ASCENDING,
      },
      searchResults: [
        makeSearchResult({ docketNumber: '101-19' }),
        makeSearchResult({ docketNumber: '102-19' }),
      ],
    });

    expect(
      result.formattedSearchResults.map(
        searchResult => searchResult.docketNumber,
      ),
    ).toEqual(['101-19', '102-19']);
  });

  it('should reflect an explicitly provided ascending case title sort in display metadata', () => {
    expect(
      runHelper({
        caseSearchSort: {
          sortColumn: 'caseTitle',
          sortDirection: ASCENDING,
        },
        searchResults: [makeSearchResult()],
      }),
    ).toMatchObject({
      caseSearchMobileSortValue: `caseTitle|${ASCENDING}`,
      caseSearchSortColumnForDisplay: 'caseTitle',
      caseSearchSortDirectionForDisplay: ASCENDING,
    });
  });
});
