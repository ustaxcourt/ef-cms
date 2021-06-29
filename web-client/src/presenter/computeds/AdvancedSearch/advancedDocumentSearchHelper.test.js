import {
  advancedDocumentSearchHelper as advancedDocumentSearchHelperComputed,
  formatDocumentSearchResultRecord,
} from './advancedDocumentSearchHelper';
import { applicationContextForClient as applicationContext } from '../../../../../shared/src/business/test/createTestApplicationContext';
import { runCompute } from 'cerebral/test';
import { withAppContextDecorator } from '../../../withAppContext';

describe('advancedDocumentSearchHelper', () => {
  const pageSizeOverride = 5;
  const manyResultsOverride = 4;

  const {
    DOCKET_NUMBER_SUFFIXES,
    OPINION_EVENT_CODES_WITH_BENCH_OPINION,
    ORDER_EVENT_CODES,
  } = applicationContext.getConstants();

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

  it('returns capitalized document type verbiage and isPublic when both the form and searchResults are empty and the search tab is opinion', () => {
    const result = runCompute(advancedDocumentSearchHelper, {
      state: {
        advancedSearchForm: {},
        advancedSearchTab:
          applicationContext.getConstants().ADVANCED_SEARCH_TABS.OPINION,
        constants: {
          ADVANCED_SEARCH_TABS:
            applicationContext.getConstants().ADVANCED_SEARCH_TABS,
        },
        isPublic: true,
      },
    });

    expect(result).toEqual({
      documentTypeVerbiage: 'Opinion Type',
      isPublic: true,
      manyResults: manyResultsOverride,
      showManyResultsMessage: false,
      showSealedIcon: false,
    });
  });

  it('returns capitalized document type verbiage and isPublic when both the form and searchResults are empty and the search tab is order', () => {
    const result = runCompute(advancedDocumentSearchHelper, {
      state: {
        advancedSearchForm: {},
        advancedSearchTab:
          applicationContext.getConstants().ADVANCED_SEARCH_TABS.ORDER,
        constants: {
          ADVANCED_SEARCH_TABS:
            applicationContext.getConstants().ADVANCED_SEARCH_TABS,
        },
        isPublic: true,
      },
    });

    expect(result).toEqual({
      documentTypeVerbiage: 'Order',
      isPublic: true,
      manyResults: manyResultsOverride,
      showManyResultsMessage: false,
      showSealedIcon: true,
    });
  });

  it('returns showNoMatches true and showSearchResults false when searchResults are empty', () => {
    const result = runCompute(advancedDocumentSearchHelper, {
      state: {
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

  it('returns isPublic false if state.isPublic is not defined', () => {
    const result = runCompute(advancedDocumentSearchHelper, {
      state: {
        advancedSearchForm: { currentPage: 1 },
        advancedSearchTab:
          applicationContext.getConstants().ADVANCED_SEARCH_TABS.OPINION,
        searchResults: { opinion: [], order: [] },
      },
    });

    expect(result.isPublic).toBeFalsy();
  });

  it('returns isPublic true if state.isPublic is true', () => {
    const result = runCompute(advancedDocumentSearchHelper, {
      state: {
        advancedSearchForm: { currentPage: 1 },
        advancedSearchTab:
          applicationContext.getConstants().ADVANCED_SEARCH_TABS.OPINION,
        isPublic: true,
        searchResults: { opinion: [], order: [] },
      },
    });

    expect(result).toBeTruthy();
  });

  it('returns showNoMatches false, showSearchResults true, and the resultsCount when searchResults are not empty', () => {
    const result = runCompute(advancedDocumentSearchHelper, {
      state: {
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

  it('does not show sealed case icon for public opinion search', () => {
    const result = runCompute(advancedDocumentSearchHelper, {
      state: {
        advancedSearchTab:
          applicationContext.getConstants().ADVANCED_SEARCH_TABS.OPINION,
        isPublic: true,
        searchResults: {
          opinion: [
            {
              docketNumber: '101-19',
              docketNumberSuffix: 'Z',
              documentContents: 'Test Petitioner, Petitioner',
              documentTitle: 'Opinion',
              documentType: 'Memorandum Opinion',
              filingDate: '2019-03-01T05:00:00.000Z',
              isSealed: true,
              judge: 'Judge Buch',
            },
          ],
        },
      },
    });

    expect(result).toMatchObject({
      searchResultsCount: 1,
      showSealedIcon: false,
    });
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

    it('sets formattedSignedJudgeName to an empty string when the search result is an order that does NOT have a signedJudgeName', () => {
      const mockResult = {
        eventCode: ORDER_EVENT_CODES[0],
        signedJudgeName: undefined,
      };

      const result = formatDocumentSearchResultRecord(mockResult, '', {
        applicationContext,
      });

      expect(result.formattedSignedJudgeName).toEqual('');
    });

    it('sets formattedSignedJudgeName to the judge last name when the search result is an order that has a signedJudgeName', () => {
      const mockJudgeName = 'Michael G. Scott';
      const mockResult = {
        eventCode: ORDER_EVENT_CODES[0],
        signedJudgeName: mockJudgeName,
      };

      const result = formatDocumentSearchResultRecord(mockResult, '', {
        applicationContext,
      });

      expect(result.formattedSignedJudgeName).toEqual('Scott');
    });
  });
});
