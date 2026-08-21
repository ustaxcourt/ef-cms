import { RawUser } from '@shared/business/entities/User';
import {
  CASE_SEARCH_SORT_OPTIONS,
  DEFAULT_CASE_SEARCH_SORT,
  type CaseSearchSort,
  type CaseSearchResult,
} from './advancedCaseSearchHelper';
import { advancedSearchHelper as advancedSearchHelperComputed } from './advancedSearchHelper';
import { applicationContextForClient as applicationContext } from '@web-client/test/createClientTestApplicationContext';
import {
  docketClerk1User,
  privatePractitionerUser,
} from '@shared/test/mockUsers';
import { getUserPermissions } from '@web-client/authorization/getUserPermissions';
import { runCompute } from '@web-client/presenter/test.cerebral';
import { withAppContextDecorator } from '../../../withAppContext';

describe('advancedSearchHelper', () => {
  const { ASCENDING, DESCENDING, COUNTRY_TYPES } =
    applicationContext.getConstants();
  const { ADVANCED_SEARCH_TABS } = applicationContext.getConstants();

  const advancedSearchHelper = withAppContextDecorator(
    advancedSearchHelperComputed,
    {
      ...applicationContext,
    },
  );

  const getBaseState = (user: RawUser = docketClerk1User) => {
    return {
      permissions: getUserPermissions(user),
      user,
    };
  };

  const getCaseSearchState = ({
    caseCurrentPaginationPage,
    caseSearchSort,
    countryType,
    searchResults,
    user = docketClerk1User,
  }: {
    caseCurrentPaginationPage?: number;
    caseSearchSort?: CaseSearchSort;
    countryType?: string;
    searchResults?: CaseSearchResult[];
    user?: RawUser;
  }) => {
    return {
      ...getBaseState(user),
      advancedSearchForm: {
        caseSearchByName: {
          countryType,
        },
      },
      advancedSearchTab: ADVANCED_SEARCH_TABS.CASE,
      caseCurrentPaginationPage,
      caseSearchSort: caseSearchSort || DEFAULT_CASE_SEARCH_SORT,
      searchResults:
        searchResults === undefined ? undefined : { case: searchResults },
    };
  };

  const runCaseSearchHelper = (
    options: Parameters<typeof getCaseSearchState>[0],
  ) => {
    return runCompute(advancedSearchHelper, {
      state: getCaseSearchState(options),
    });
  };

  it('should return default display values when permissions are not defined in state', () => {
    const result = runCompute(advancedSearchHelper, {
      state: {
        advancedSearchForm: {},
        advancedSearchTab: ADVANCED_SEARCH_TABS.CASE,
      },
    });

    expect(result).toEqual({
      caseSearchMobileSortValue: `resultIndex|${ASCENDING}`,
      caseSearchSortColumnForDisplay: 'resultIndex',
      caseSearchSortDirectionForDisplay: ASCENDING,
      formattedSearchResults: [],
      numberOfResults: 0,
      showManyResultsMessage: false,
      showNoMatches: false,
      showPractitionerSearch: undefined,
      showSearchResults: false,
      showStateSelect: false,
      sortOptions: CASE_SEARCH_SORT_OPTIONS,
      totalPages: 0,
    });
  });

  it('should return default display values when searchResults is undefined', () => {
    const result = runCaseSearchHelper({});

    expect(result).toMatchObject({
      formattedSearchResults: [],
      numberOfResults: 0,
      showNoMatches: false,
      showPractitionerSearch: true,
      showSearchResults: false,
      showStateSelect: false,
      caseSearchMobileSortValue: `resultIndex|${ASCENDING}`,
      caseSearchSortColumnForDisplay: 'resultIndex',
      caseSearchSortDirectionForDisplay: ASCENDING,
      totalPages: 0,
    });
  });

  it('should return shared default values when search results exist for a tab that is not CASE', () => {
    const result = runCompute(advancedSearchHelper, {
      state: {
        ...getBaseState(),
        advancedSearchForm: {},
        advancedSearchTab: ADVANCED_SEARCH_TABS.ORDER,
        searchResults: {
          order: [{}],
        },
      },
    });

    expect(result).toMatchObject({
      formattedSearchResults: [],
      numberOfResults: 0,
      showNoMatches: false,
      showSearchResults: false,
      totalPages: 0,
    });
  });

  it('should hide practitioner search when the user is external', () => {
    const result = runCaseSearchHelper({
      user: privatePractitionerUser,
    });

    expect(result.showPractitionerSearch).toBe(false);
  });

  it('should show the state selector when the case search country type is domestic', () => {
    const result = runCaseSearchHelper({
      countryType: COUNTRY_TYPES.DOMESTIC,
    });

    expect(result).toMatchObject({
      showPractitionerSearch: true,
      showStateSelect: true,
    });
  });

  it('should hide the state selector when the case search country type is international', () => {
    const result = runCaseSearchHelper({
      countryType: COUNTRY_TYPES.INTERNATIONAL,
    });

    expect(result).toMatchObject({
      showPractitionerSearch: true,
      showStateSelect: false,
    });
  });

  it('should delegate case search state to the advanced case search helper', () => {
    const result = runCaseSearchHelper({
      caseSearchSort: {
        sortColumn: 'docketNumber',
        sortDirection: DESCENDING,
      },
      searchResults: [],
    });

    expect(result).toMatchObject({
      formattedSearchResults: [],
      numberOfResults: 0,
      showManyResultsMessage: false,
      showNoMatches: true,
      showSearchResults: false,
      totalPages: 0,
    });
    expect(result).toMatchObject({
      caseSearchMobileSortValue: `docketNumber|${DESCENDING}`,
      caseSearchSortColumnForDisplay: 'docketNumber',
      caseSearchSortDirectionForDisplay: DESCENDING,
    });
  });

  it('should return shared default values when on the practitioner tab', () => {
    const result = runCompute(advancedSearchHelper, {
      state: {
        ...getBaseState(),
        advancedSearchForm: {},
        advancedSearchTab: ADVANCED_SEARCH_TABS.PRACTITIONER,
        searchResults: {
          practitioner: [
            {
              admissionsDate: '2012-03-13',
              barNumber: '1111',
              contact: { state: 'WA' },
              name: 'pablo escobar',
            },
          ],
        },
      },
    });

    expect(result).toMatchObject({
      formattedSearchResults: [],
      numberOfResults: 0,
      showPractitionerSearch: true,
      showSearchResults: false,
      showStateSelect: false,
    });
  });
});
