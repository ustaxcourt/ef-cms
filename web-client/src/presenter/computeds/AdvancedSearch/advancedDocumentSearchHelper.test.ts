import { advancedDocumentSearchHelper as advancedDocumentSearchHelperComputed } from './advancedDocumentSearchHelper';
import { applicationContextForClient as applicationContext } from '@web-client/test/createClientTestApplicationContext';
import { getUserPermissions } from '@web-client/authorization/getUserPermissions';
import { runCompute } from '@web-client/presenter/test.cerebral';
import { withAppContextDecorator } from '../../../withAppContext';

describe('advancedDocumentSearchHelper', () => {
  const pageSizeOverride = 5;
  const manyResultsOverride = 4;

  const { DATE_RANGE_SEARCH_OPTIONS, DOCKET_NUMBER_SUFFIXES, USER_ROLES } =
    applicationContext.getConstants();

  const globalUser = {
    role: USER_ROLES.docketClerk,
    userId: 'docketClerk',
  };

  const getBaseState = user => {
    return {
      advancedSearchTab: 'order',
      legacyAndCurrentJudges: [
        {
          judgeFullName: 'George Foreman',
          role: USER_ROLES.judge,
        },
        {
          judgeFullName: 'Curious George',
          role: USER_ROLES.legacyJudge,
        },
      ],
      orderDocumentSearchSort: {
        sortColumn: 'formattedFiledDate',
        sortDirection: 'desc',
      },
      opinionDocumentSearchSort: {
        sortColumn: 'formattedFiledDate',
        sortDirection: 'desc',
      },
      permissions: getUserPermissions(user),
      user,
    };
  };

  const advancedDocumentSearchHelper = withAppContextDecorator(
    advancedDocumentSearchHelperComputed,
    {
      ...applicationContext,
      getConstants: () => {
        return {
          ...applicationContext.getConstants(),
          CASE_SEARCH_PAGE_SIZE: pageSizeOverride,
          MAX_DOCUMENT_SEARCH_RESULTS: manyResultsOverride,
        };
      },
    },
  );

  describe('isInternalUser', () => {
    it('should return true if the user is an internal user', () => {
      const result = runCompute(advancedDocumentSearchHelper, {
        state: getBaseState(globalUser),
      });
      expect(result.isInternalUser).toEqual(true);
    });

    it('should return false if the user is not an internal user', () => {
      const result = runCompute(advancedDocumentSearchHelper, {
        state: getBaseState({
          role: USER_ROLES.privatePractitioner,
        }),
      });
      expect(result.isInternalUser).toEqual(false);
    });

    it('should return false if there is no user because the user is public', () => {
      const result = runCompute(advancedDocumentSearchHelper, {
        state: getBaseState({
          user: {},
        }),
      });
      expect(result.isInternalUser).toEqual(false);
    });
  });

  describe('showDateRangePicker', () => {
    it('should be false when state.advancedSearchForm.orderSearch.dateRange is allDates', () => {
      const result = runCompute(advancedDocumentSearchHelper, {
        state: {
          ...getBaseState(globalUser),
          advancedSearchForm: {
            orderSearch: { dateRange: DATE_RANGE_SEARCH_OPTIONS.ALL_DATES },
          },
        },
      });

      expect(result.showDateRangePicker).toBeFalsy();
    });

    it('should be true when state.advancedSearchForm.orderSearch.dateRange is customDates', () => {
      const result = runCompute(advancedDocumentSearchHelper, {
        state: {
          ...getBaseState(globalUser),
          advancedSearchForm: {
            orderSearch: { dateRange: DATE_RANGE_SEARCH_OPTIONS.CUSTOM_DATES },
          },
        },
      });

      expect(result.showDateRangePicker).toBeTruthy();
    });

    it('should be false when state.advancedSearchForm.opinionSearch.dateRange is allDates', () => {
      const result = runCompute(advancedDocumentSearchHelper, {
        state: {
          ...getBaseState(globalUser),
          advancedSearchForm: {
            opinionSearch: { dateRange: DATE_RANGE_SEARCH_OPTIONS.ALL_DATES },
          },
          advancedSearchTab: 'opinion',
        },
      });

      expect(result.showDateRangePicker).toBeFalsy();
    });

    it('should be true when state.advancedSearchForm.opinionSearch.dateRange is customDates', () => {
      const result = runCompute(advancedDocumentSearchHelper, {
        state: {
          ...getBaseState(globalUser),
          advancedSearchForm: {
            opinionSearch: {
              dateRange: DATE_RANGE_SEARCH_OPTIONS.CUSTOM_DATES,
            },
          },
          advancedSearchTab: 'opinion',
        },
      });

      expect(result.showDateRangePicker).toBeTruthy();
    });
  });

  it('returns formatted judges with a last name', () => {
    const result = runCompute(advancedDocumentSearchHelper, {
      state: {
        ...getBaseState(globalUser),
      },
    });

    expect(result.formattedJudges).toEqual([
      {
        judgeFullName: 'George Foreman',
        lastName: 'Foreman',
        role: 'judge',
      },
      {
        judgeFullName: 'Curious George',
        lastName: 'George',
        role: 'legacyJudge',
      },
    ]);
  });

  it('returns capitalized document type verbiage when both the form and searchResults are empty and the search tab is opinion', () => {
    const result = runCompute(advancedDocumentSearchHelper, {
      state: {
        ...getBaseState(globalUser),
        advancedSearchForm: {},
        advancedSearchTab:
          applicationContext.getConstants().ADVANCED_SEARCH_TABS.OPINION,
        constants: {
          ADVANCED_SEARCH_TABS:
            applicationContext.getConstants().ADVANCED_SEARCH_TABS,
        },
      },
    });

    expect(result).toMatchObject({
      documentTypeVerbiage: 'Opinion Type',
      manyResults: manyResultsOverride,
      showDateRangePicker: false,
      showManyResultsMessage: false,
    });
  });

  it('returns capitalized document type verbiage when both the form and searchResults are empty and the search tab is order', () => {
    const result = runCompute(advancedDocumentSearchHelper, {
      state: {
        ...getBaseState(globalUser),
        advancedSearchForm: {},
        advancedSearchTab:
          applicationContext.getConstants().ADVANCED_SEARCH_TABS.ORDER,
        constants: {
          ADVANCED_SEARCH_TABS:
            applicationContext.getConstants().ADVANCED_SEARCH_TABS,
        },
      },
    });

    expect(result).toMatchObject({
      documentTypeVerbiage: 'Order',
      manyResults: manyResultsOverride,
      showDateRangePicker: false,
      showManyResultsMessage: false,
    });
  });

  it('returns showNoMatches true and showSearchResults false when searchResults are empty', () => {
    const result = runCompute(advancedDocumentSearchHelper, {
      state: {
        ...getBaseState(globalUser),
        advancedSearchForm: { currentPage: 1 },
        advancedSearchTab:
          applicationContext.getConstants().ADVANCED_SEARCH_TABS.OPINION,
        searchResults: { opinion: [], order: [] },
      },
    });

    expect(result).toMatchObject({
      showLoadMore: false,
      showNoMatches: true,
      showSearchResults: false,
    });
  });

  it('returns showNoMatches false, showSearchResults true, and the resultsCount when searchResults are not empty', () => {
    const result = runCompute(advancedDocumentSearchHelper, {
      state: {
        ...getBaseState(globalUser),
        advancedSearchForm: { currentPage: 1 },
        advancedSearchTab:
          applicationContext.getConstants().ADVANCED_SEARCH_TABS.ORDER,
        searchResults: {
          order: [
            {
              docketNumber: '101-19',
              docketNumberSuffix: 'Z',
              documentContents: 'Test Petitioner, Petitioner',
              documentTitle: 'Order',
              documentType: 'Order',
              filingDate: '2019-03-01T05:00:00.000Z',
              judge: 'Judge Buch',
            },
          ],
        },
      },
    });

    expect(result).toMatchObject({
      manyResults: manyResultsOverride,
      searchResultsCount: 1,
      showLoadMore: false,
      showManyResultsMessage: false,
      showNoMatches: false,
      showSearchResults: true,
    });
  });

  it('returns showManyResultsMessage true if maximum number of results has been reached', () => {
    const result = runCompute(advancedDocumentSearchHelper, {
      state: {
        ...getBaseState(globalUser),
        advancedSearchForm: { currentPage: 1 },
        advancedSearchTab:
          applicationContext.getConstants().ADVANCED_SEARCH_TABS.ORDER,
        searchResults: {
          order: [
            {
              docketNumber: '101-19',
              docketNumberSuffix: 'Z',
              documentContents: 'Test Petitioner, Petitioner',
              documentTitle: 'Order',
              documentType: 'Order',
              filingDate: '2019-03-01T05:00:00.000Z',
              judge: 'Judge Buch',
            },
            {
              docketNumber: '102-19',
              docketNumberSuffix: 'Z',
              documentContents: 'Test Petitioner, Petitioner',
              documentTitle: 'Order',
              documentType: 'Order',
              filingDate: '2019-03-01T05:00:00.000Z',
              judge: 'Judge Buch',
            },
            {
              docketNumber: '103-19',
              docketNumberSuffix: 'Z',
              documentContents: 'Test Petitioner, Petitioner',
              documentTitle: 'Order',
              documentType: 'Order',
              filingDate: '2019-03-01T05:00:00.000Z',
              judge: 'Judge Buch',
            },
            {
              docketNumber: '104-19',
              docketNumberSuffix: 'Z',
              documentContents: 'Test Petitioner, Petitioner',
              documentTitle: 'Order',
              documentType: 'Order',
              filingDate: '2019-03-01T05:00:00.000Z',
              judge: 'Judge Buch',
            },
          ],
        },
      },
    });

    expect(result).toMatchObject({
      manyResults: manyResultsOverride,
      searchResultsCount: 4,
      showLoadMore: false,
      showManyResultsMessage: true,
      showNoMatches: false,
      showSearchResults: true,
    });
  });

  it('formats search results for an order search', () => {
    const result = runCompute(advancedDocumentSearchHelper, {
      state: {
        ...getBaseState(globalUser),
        advancedSearchForm: { currentPage: 1 },
        advancedSearchTab:
          applicationContext.getConstants().ADVANCED_SEARCH_TABS.ORDER,
        searchResults: {
          order: [
            {
              caseCaption: 'Test Petitioner, Petitioner',
              docketNumber: '101-19',
              docketNumberSuffix: 'Z',
              docketNumberWithSuffix: '101-19Z',
              documentContents: 'Test Petitioner, Petitioner',
              eventCode: 'O',
              filingDate: '2019-03-01T05:00:00.000Z',
              judge: 'Judge Buch',
            },
            {
              caseCaption: 'Test Petitioner, Petitioner',
              docketNumber: '102-19',
              docketNumberSuffix: DOCKET_NUMBER_SUFFIXES.PASSPORT,
              docketNumberWithSuffix: '102-19P',
              documentContents: 'Test Petitioner, Petitioner',
              filingDate: '2019-03-01T05:00:00.000Z',
              judge: 'Cohen',
            },
          ],
        },
      },
    });

    expect(result.numberOfResults).toEqual(2);
    expect(result.formattedSearchResults).toMatchObject([
      {
        caseTitle: 'Test Petitioner',
        docketNumber: '101-19',
        docketNumberSuffix: 'Z',
        docketNumberWithSuffix: '101-19Z',
        documentContents: 'Test Petitioner, Petitioner',
        filingDate: '2019-03-01T05:00:00.000Z',
        formattedFiledDate: '03/01/2019',
        judge: 'Judge Buch',
      },
      {
        caseTitle: 'Test Petitioner',
        docketNumber: '102-19',
        docketNumberSuffix: DOCKET_NUMBER_SUFFIXES.PASSPORT,
        docketNumberWithSuffix: '102-19P',
        documentContents: 'Test Petitioner, Petitioner',
        filingDate: '2019-03-01T05:00:00.000Z',
        formattedFiledDate: '03/01/2019',
        judge: 'Cohen',
      },
    ]);
  });

  it('formats search results for an opinion search', () => {
    const result = runCompute(advancedDocumentSearchHelper, {
      state: {
        ...getBaseState(globalUser),
        advancedSearchForm: { currentPage: 1 },
        advancedSearchTab:
          applicationContext.getConstants().ADVANCED_SEARCH_TABS.OPINION,
        searchResults: {
          opinion: [
            {
              caseCaption: 'Test Petitioner, Petitioner',
              docketNumber: '101-19',
              docketNumberSuffix: 'Z',
              docketNumberWithSuffix: '101-19Z',
              documentContents: 'Test Petitioner, Petitioner',
              documentTitle: 'My Opinion',
              documentType: 'T.C. Opinion',
              eventCode: 'TCOP',
              filingDate: '2019-03-01T05:00:00.000Z',
              judge: 'Judge Buch',
            },
            {
              caseCaption: 'Test Petitioner, Petitioner',
              docketNumber: '102-19',
              docketNumberSuffix: DOCKET_NUMBER_SUFFIXES.PASSPORT,
              docketNumberWithSuffix: '102-19P',
              documentContents: 'Test Petitioner, Petitioner',
              documentTitle: 'Opinion for Stuff',
              documentType: 'Summary Opinion',
              eventCode: 'SOP',
              filingDate: '2019-03-01T05:00:00.000Z',
              judge: 'Cohen',
            },
          ],
        },
      },
    });

    expect(result.formattedSearchResults).toMatchObject([
      {
        caseTitle: 'Test Petitioner',
        docketNumber: '101-19',
        docketNumberSuffix: 'Z',
        docketNumberWithSuffix: '101-19Z',
        documentContents: 'Test Petitioner, Petitioner',
        documentTitle: 'T.C. Opinion',
        documentType: 'T.C. Opinion',
        filingDate: '2019-03-01T05:00:00.000Z',
        formattedFiledDate: '03/01/2019',
        judge: 'Judge Buch',
      },
      {
        caseTitle: 'Test Petitioner',
        docketNumber: '102-19',
        docketNumberSuffix: DOCKET_NUMBER_SUFFIXES.PASSPORT,
        docketNumberWithSuffix: '102-19P',
        documentContents: 'Test Petitioner, Petitioner',
        documentTitle: 'Summary Opinion',
        documentType: 'Summary Opinion',
        filingDate: '2019-03-01T05:00:00.000Z',
        formattedFiledDate: '03/01/2019',
        judge: 'Cohen',
      },
    ]);
  });

  it('does not show sealed icon for opinion search', () => {
    const { searchResults } = runCompute(advancedDocumentSearchHelper, {
      state: {
        ...getBaseState(globalUser),
        advancedSearchForm: { currentPage: 1 },
        advancedSearchTab:
          applicationContext.getConstants().ADVANCED_SEARCH_TABS.OPINION,
        searchResults: {
          opinion: [
            {
              docketNumber: '101-19',
              docketNumberSuffix: 'Z',
              documentContents: 'Test Petitioner, Petitioner',
              documentTitle: 'Opinion',
              documentType: 'Memorandum Opinion',
              filingDate: '2019-03-01T05:00:00.000Z',
              isCaseSealed: true,
              isDocketEntrySealed: false,
              judge: 'Judge Buch',
            },
          ],
        },
      },
    });

    expect(searchResults).toMatchObject([
      {
        showSealedIcon: false,
      },
    ]);
  });

  it('sort by docket number', () => {
    const result = runCompute(advancedDocumentSearchHelper, {
      state: {
        ...getBaseState(globalUser),
        advancedSearchForm: { currentPage: 1 },
        advancedSearchTab:
          applicationContext.getConstants().ADVANCED_SEARCH_TABS.ORDER,
        orderDocumentSearchSort: {
          sortColumn: 'docketNumber',
          sortDirection: 'asc',
        },
        searchResults: {
          order: [
            {
              docketNumber: '101-19',
              docketNumberWithSuffix: '101-19Z',
            },
            {
              docketNumber: '103-19',
              docketNumberWithSuffix: '102-19P',
            },
            {
              docketNumber: '102-19',
              docketNumberWithSuffix: '102-19P',
            },
          ],
        },
      },
    });
    const expected = ['101-19', '102-19', '103-19'];
    expect(result.formattedSearchResults.map(r => r.docketNumber)).toEqual(
      expected,
    );
  });

  it('sort by formattedFiledDate string', () => {
    const result = runCompute(advancedDocumentSearchHelper, {
      state: {
        ...getBaseState(globalUser),
        advancedSearchForm: { currentPage: 1 },
        advancedSearchTab:
          applicationContext.getConstants().ADVANCED_SEARCH_TABS.ORDER,
        orderDocumentSearchSort: {
          sortColumn: 'formattedFiledDate',
          sortDirection: 'asc',
        },
        searchResults: {
          order: [
            {
              docketNumber: '101-19',
              docketNumberWithSuffix: '101-19Z',
              filingDate: '2019-03-01T05:00:00.000Z',
            },
            {
              docketNumber: '103-19',
              docketNumberWithSuffix: '102-19P',
              filingDate: '2019-04-01T05:00:00.000Z',
            },
            {
              docketNumber: '102-19',
              docketNumberWithSuffix: '102-19P',
              filingDate: '2019-02-01T05:00:00.000Z',
            },
          ],
        },
      },
    });
    const expected = [
      '2019-02-01T05:00:00.000Z',
      '2019-03-01T05:00:00.000Z',
      '2019-04-01T05:00:00.000Z',
    ];
    expect(result.formattedSearchResults.map(r => r.filingDate)).toEqual(
      expected,
    );
  });

  it('sort by numberOfPages', () => {
    const result = runCompute(advancedDocumentSearchHelper, {
      state: {
        ...getBaseState(globalUser),
        advancedSearchForm: { currentPage: 1 },
        advancedSearchTab:
          applicationContext.getConstants().ADVANCED_SEARCH_TABS.ORDER,
        orderDocumentSearchSort: {
          sortColumn: 'numberOfPages',
          sortDirection: 'asc',
        },
        searchResults: {
          order: [
            {
              docketNumber: '101-19',
              docketNumberWithSuffix: '101-19Z',
              numberOfPages: 3,
            },
            {
              docketNumber: '101-19',
              docketNumberWithSuffix: '101-19Z',
              numberOfPages: 2,
            },
            {
              docketNumber: '101-19',
              docketNumberWithSuffix: '101-19Z',
              numberOfPages: 5,
            },
          ],
        },
      },
    });
    const expected = [2, 3, 5];
    expect(result.formattedSearchResults.map(r => r.numberOfPages)).toEqual(
      expected,
    );
  });

  it('sort by judge asc', () => {
    const result = runCompute(advancedDocumentSearchHelper, {
      state: {
        ...getBaseState(globalUser),
        advancedSearchForm: { currentPage: 1 },
        advancedSearchTab:
          applicationContext.getConstants().ADVANCED_SEARCH_TABS.OPINION,
        opinionDocumentSearchSort: {
          sortColumn: 'judge',
          sortDirection: 'asc',
        },
        searchResults: {
          opinion: [
            {
              judge: 'Cohen',
            },
            {
              judge: 'Buch',
            },
            {
              judge: 'Aardvark',
            },
          ],
        },
      },
    });
    const expected = ['Aardvark', 'Buch', 'Cohen'];
    expect(result.formattedSearchResults.map(r => r.judge)).toEqual(expected);
  });

  it('sort by judge desc', () => {
    const result = runCompute(advancedDocumentSearchHelper, {
      state: {
        ...getBaseState(globalUser),
        advancedSearchForm: { currentPage: 1 },
        advancedSearchTab:
          applicationContext.getConstants().ADVANCED_SEARCH_TABS.OPINION,
        opinionDocumentSearchSort: {
          sortColumn: 'judge',
          sortDirection: 'desc',
        },
        searchResults: {
          opinion: [
            {
              judge: 'Buch',
            },
            {
              judge: 'Cohen',
            },
            {
              judge: 'Aardvark',
            },
          ],
        },
      },
    });
    const expected = ['Cohen', 'Buch', 'Aardvark'];
    expect(result.formattedSearchResults.map(r => r.judge)).toEqual(expected);
  });
});
