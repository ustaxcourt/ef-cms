import { advancedDocumentSearchHelper as advancedDocumentSearchHelperComputed } from './advancedDocumentSearchHelper';
import { applicationContext } from '../../../applicationContext';
import { runCompute } from 'cerebral/test';
import { withAppContextDecorator } from '../../../withAppContext';

describe('advancedDocumentSearchHelper', () => {
  const pageSizeOverride = 5;

  const advancedDocumentSearchHelper = withAppContextDecorator(
    advancedDocumentSearchHelperComputed,
    {
      ...applicationContext,
      getConstants: () => {
        return {
          ...applicationContext.getConstants(),
          CASE_SEARCH_PAGE_SIZE: pageSizeOverride,
        };
      },
    },
  );

  it('returns capitalized document type verbiage and isPublic when both the form and searchResults are empty and the search tab is opinion', () => {
    const result = runCompute(advancedDocumentSearchHelper, {
      state: {
        advancedSearchForm: {},
        advancedSearchTab: applicationContext.getConstants()
          .ADVANCED_SEARCH_TABS.OPINION,
        constants: {
          ADVANCED_SEARCH_TABS: applicationContext.getConstants()
            .ADVANCED_SEARCH_TABS,
        },
        isPublic: true,
      },
    });

    expect(result).toEqual({
      documentTypeVerbiage: 'Opinion Type',
      isPublic: true,
      showSealedIcon: false,
    });
  });

  it('returns capitalized document type verbiage and isPublic when both the form and searchResults are empty and the search tab is order', () => {
    const result = runCompute(advancedDocumentSearchHelper, {
      state: {
        advancedSearchForm: {},
        advancedSearchTab: applicationContext.getConstants()
          .ADVANCED_SEARCH_TABS.ORDER,
        constants: {
          ADVANCED_SEARCH_TABS: applicationContext.getConstants()
            .ADVANCED_SEARCH_TABS,
        },
        isPublic: true,
      },
    });

    expect(result).toEqual({
      documentTypeVerbiage: 'Order',
      isPublic: true,
      showSealedIcon: true,
    });
  });

  it('returns showNoMatches true and showSearchResults false when searchResults are empty', () => {
    const result = runCompute(advancedDocumentSearchHelper, {
      state: {
        advancedSearchForm: { currentPage: 1 },
        constants: {
          ADVANCED_SEARCH_TABS: applicationContext.getConstants()
            .ADVANCED_SEARCH_TABS,
        },
        searchResults: [],
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
        constants: {
          ADVANCED_SEARCH_TABS: applicationContext.getConstants()
            .ADVANCED_SEARCH_TABS,
        },
        searchResults: [],
      },
    });

    expect(result.isPublic).toBeFalsy();
  });

  it('returns isPublic true if state.isPublic is true', () => {
    const result = runCompute(advancedDocumentSearchHelper, {
      state: {
        advancedSearchForm: { currentPage: 1 },
        constants: {
          ADVANCED_SEARCH_TABS: applicationContext.getConstants()
            .ADVANCED_SEARCH_TABS,
        },
        isPublic: true,
        searchResults: [],
      },
    });

    expect(result).toBeTruthy();
  });

  it('returns showNoMatches false, showSearchResults true, and the resultsCount when searchResults are not empty', () => {
    const result = runCompute(advancedDocumentSearchHelper, {
      state: {
        advancedSearchForm: { currentPage: 1 },
        constants: {
          ADVANCED_SEARCH_TABS: applicationContext.getConstants()
            .ADVANCED_SEARCH_TABS,
        },
        searchResults: [
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
    });

    expect(result).toMatchObject({
      searchResultsCount: 1,
      showLoadMore: false,
      showNoMatches: false,
      showSearchResults: true,
    });
  });

  it('formats search results for an order search', () => {
    const result = runCompute(advancedDocumentSearchHelper, {
      state: {
        advancedSearchForm: { currentPage: 1 },
        advancedSearchTab: applicationContext.getConstants()
          .ADVANCED_SEARCH_TABS.ORDER,
        constants: {
          ADVANCED_SEARCH_TABS: applicationContext.getConstants()
            .ADVANCED_SEARCH_TABS,
        },
        searchResults: [
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
            docketNumberSuffix: 'P',
            docketNumberWithSuffix: '102-19P',
            documentContents: 'Test Petitioner, Petitioner',
            documentTitle: 'Order for Stuff',
            documentType: 'OAPF - Order for Amended Petition and Filing Fee',
            filingDate: '2019-03-01T05:00:00.000Z',
            judge: 'Judge Cohen',
          },
        ],
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
        formattedDocumentType: 'Order',
        formattedFiledDate: '03/01/19',
        judge: 'Judge Buch',
      },
      {
        caseTitle: 'Test Petitioner',
        docketNumber: '102-19',
        docketNumberSuffix: 'P',
        docketNumberWithSuffix: '102-19P',
        documentContents: 'Test Petitioner, Petitioner',
        documentTitle: 'Order for Stuff',
        documentType: 'OAPF - Order for Amended Petition and Filing Fee',
        filingDate: '2019-03-01T05:00:00.000Z',
        formattedDocumentType: 'Order for Amended Petition and Filing Fee',
        formattedFiledDate: '03/01/19',
        judge: 'Judge Cohen',
      },
    ]);
  });

  it('formats search results for an opinion search', () => {
    const result = runCompute(advancedDocumentSearchHelper, {
      state: {
        advancedSearchForm: { currentPage: 1 },
        advancedSearchTab: applicationContext.getConstants()
          .ADVANCED_SEARCH_TABS.OPINION,
        constants: {
          ADVANCED_SEARCH_TABS: applicationContext.getConstants()
            .ADVANCED_SEARCH_TABS,
        },
        searchResults: [
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
            docketNumberSuffix: 'P',
            docketNumberWithSuffix: '102-19P',
            documentContents: 'Test Petitioner, Petitioner',
            documentTitle: 'Opinion for Stuff',
            documentType: 'Summary Opinion',
            eventCode: 'SOP',
            filingDate: '2019-03-01T05:00:00.000Z',
            judge: 'Judge Cohen',
          },
        ],
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
        formattedDocumentType: 'T.C. Opinion',
        formattedFiledDate: '03/01/19',
        judge: 'Judge Buch',
      },
      {
        caseTitle: 'Test Petitioner',
        docketNumber: '102-19',
        docketNumberSuffix: 'P',
        docketNumberWithSuffix: '102-19P',
        documentContents: 'Test Petitioner, Petitioner',
        documentTitle: 'Summary Opinion',
        documentType: 'Summary Opinion',
        filingDate: '2019-03-01T05:00:00.000Z',
        formattedDocumentType: 'Summary Opinion',
        formattedFiledDate: '03/01/19',
        judge: 'Judge Cohen',
      },
    ]);
  });

  it('does not show sealed case icon for public opinion search', () => {
    const result = runCompute(advancedDocumentSearchHelper, {
      state: {
        advancedSearchTab: applicationContext.getConstants()
          .ADVANCED_SEARCH_TABS.OPINION,
        constants: {
          ADVANCED_SEARCH_TABS: applicationContext.getConstants()
            .ADVANCED_SEARCH_TABS,
        },
        isPublic: true,
        searchResults: [
          {
            docketNumber: '101-19',
            docketNumberSuffix: 'Z',
            documentContents: 'Test Petitioner, Petitioner',
            documentTitle: 'Order',
            documentType: 'Order',
            filingDate: '2019-03-01T05:00:00.000Z',
            isSealed: true,
            judge: 'Judge Buch',
          },
        ],
      },
    });

    expect(result).toMatchObject({
      searchResultsCount: 1,
      showSealedIcon: false,
    });
  });
});
