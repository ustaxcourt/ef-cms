/* eslint-disable max-lines */

import { ADVANCED_SEARCH_TABS } from '../../../../../shared/src/business/entities/EntityConstants';
import {
  advancedDocumentSearchHelper as advancedDocumentSearchHelperComputed,
  formatDocumentSearchResultRecord,
} from './advancedDocumentSearchHelper';
import { applicationContextForClient as applicationContext } from '@web-client/test/createClientTestApplicationContext';
import { getUserPermissions } from '../../../../../shared/src/authorization/getUserPermissions';
import { runCompute } from '@web-client/presenter/test.cerebral';
import { withAppContextDecorator } from '../../../withAppContext';

describe('advancedDocumentSearchHelper', () => {
  const pageSizeOverride = 5;
  const manyResultsOverride = 4;

  const {
    BENCH_OPINION_EVENT_CODE,
    DATE_RANGE_SEARCH_OPTIONS,
    DOCKET_NUMBER_SUFFIXES,
    GENERIC_ORDER_EVENT_CODE,
    OPINION_EVENT_CODES_WITH_BENCH_OPINION,
    USER_ROLES,
  } = applicationContext.getConstants();

  let globalUser = {
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
          MAX_SEARCH_RESULTS: manyResultsOverride,
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
              documentTitle: 'Order',
              documentType: 'Order',
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
              documentTitle: 'Order for Stuff',
              documentType: 'OAPF - Order for Amended Petition and Filing Fee',
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
        documentTitle: 'Order',
        filingDate: '2019-03-01T05:00:00.000Z',
        formattedFiledDate: '03/01/19',
        judge: 'Judge Buch',
      },
      {
        caseTitle: 'Test Petitioner',
        docketNumber: '102-19',
        docketNumberSuffix: DOCKET_NUMBER_SUFFIXES.PASSPORT,
        docketNumberWithSuffix: '102-19P',
        documentContents: 'Test Petitioner, Petitioner',
        documentTitle: 'Order for Stuff',
        documentType: 'OAPF - Order for Amended Petition and Filing Fee',
        filingDate: '2019-03-01T05:00:00.000Z',
        formattedFiledDate: '03/01/19',
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
        formattedFiledDate: '03/01/19',
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
        formattedFiledDate: '03/01/19',
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

  describe('formatDocumentSearchResultRecord', () => {
    it('sets formattedJudgeName to empty string when the search result is an opinion that does not have a judge', () => {
      const mockResult = {
        eventCode: OPINION_EVENT_CODES_WITH_BENCH_OPINION[0],
      };

      const result = formatDocumentSearchResultRecord(mockResult, '', {
        applicationContext,
      });

      expect(result.formattedJudgeName).toEqual('');
    });

    it('sets formattedJudgeName to the judge last name when the search result is an opinion that has a judge', () => {
      const mockJudgeName = 'Michael G. Scott';
      const mockResult = {
        eventCode: OPINION_EVENT_CODES_WITH_BENCH_OPINION[0],
        judge: mockJudgeName,
      };

      const result = formatDocumentSearchResultRecord(mockResult, '', {
        applicationContext,
      });

      expect(result.formattedJudgeName).toEqual('Scott');
    });

    it('sets formattedJudgeName to signedJudgeName when the search result is a bench opinion', () => {
      const mockJudgeName = 'Michael G. Scott';
      const mockResult = {
        eventCode: BENCH_OPINION_EVENT_CODE,
        signedJudgeName: mockJudgeName,
      };

      const result = formatDocumentSearchResultRecord(mockResult, '', {
        applicationContext,
      });

      expect(result.formattedJudgeName).toEqual('Scott');
    });

    it('sets formattedJudgeName to an empty string when the search result is an order that does NOT have a signedJudgeName', () => {
      const mockResult = {
        eventCode: GENERIC_ORDER_EVENT_CODE,
        signedJudgeName: undefined,
      };

      const result = formatDocumentSearchResultRecord(mockResult, '', {
        applicationContext,
      });

      expect(result.formattedJudgeName).toEqual('');
    });

    it('sets formattedJudgeName to the judge last name when the search result is an order that has a signedJudgeName', () => {
      const mockJudgeName = 'Michael G. Scott';
      const mockResult = {
        eventCode: GENERIC_ORDER_EVENT_CODE,
        signedJudgeName: mockJudgeName,
      };

      const result = formatDocumentSearchResultRecord(mockResult, '', {
        applicationContext,
      });

      expect(result.formattedJudgeName).toEqual('Scott');
    });

    it('sets formattedJudgeName to the judge field when the eventCode is SPOS', () => {
      const mockJudgeName = 'Scott';
      const mockResult = {
        eventCode: 'SPOS',
        judge: mockJudgeName,
      };

      const result = formatDocumentSearchResultRecord(mockResult, '', {
        applicationContext,
      });

      expect(result.formattedJudgeName).toEqual(mockJudgeName);
    });

    it('sets formattedJudgeName to the judge field when the eventCode is SPTO', () => {
      const mockJudgeName = 'Scott';
      const mockResult = {
        eventCode: 'SPTO',
        judge: mockJudgeName,
      };

      const result = formatDocumentSearchResultRecord(mockResult, '', {
        applicationContext,
      });

      expect(result.formattedJudgeName).toEqual(mockJudgeName);
    });

    it('sets numberOfPagesFormatted to n/a if numberOfPages is undefined', () => {
      const result = formatDocumentSearchResultRecord(
        {
          numberOfPages: undefined,
        },
        '',
        {
          applicationContext,
        },
      );
      expect(result.numberOfPagesFormatted).toEqual('n/a');
    });

    it('sets numberOfPagesFormatted to 0 if numberOfPages is 0', () => {
      const result = formatDocumentSearchResultRecord(
        {
          numberOfPages: 0,
        },
        '',
        {
          applicationContext,
        },
      );

      expect(result.numberOfPagesFormatted).toEqual(0);
    });

    it('should show the seal icon if the case is sealed', () => {
      const result = formatDocumentSearchResultRecord(
        {
          isCaseSealed: true,
        },
        ADVANCED_SEARCH_TABS.ORDER,
        {
          applicationContext,
        },
      );

      expect(result.showSealedIcon).toBe(true);
    });
  });
});
