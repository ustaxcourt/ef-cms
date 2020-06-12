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

  it('returns an empty object when searchResults is undefined', () => {
    const result = runCompute(advancedDocumentSearchHelper, {
      state: {
        advancedSearchForm: {},
      },
    });

    expect(result).toEqual({});
  });

  it('returns showNoMatches true and showSearchResults false when searchResults are empty', () => {
    const result = runCompute(advancedDocumentSearchHelper, {
      state: {
        advancedSearchForm: { currentPage: 1 },
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
        searchResults: [],
      },
    });

    expect(result.isPublic).toBeFalsy();
  });

  it('returns isPublic true if state.isPublic is true', () => {
    const result = runCompute(advancedDocumentSearchHelper, {
      state: {
        advancedSearchForm: { currentPage: 1 },
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
        searchResults: [
          {
            docketNumber: '101-19',
            docketNumberSuffix: 'Z',
            documentContents: 'Test Petitioner, Petitioner',
            documentTitle: 'Order',
            documentType: 'O - Order',
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
        searchResults: [
          {
            caseCaption: 'Test Petitioner, Petitioner',
            docketNumber: '101-19',
            docketNumberSuffix: 'Z',
            docketNumberWithSuffix: '101-19Z',
            documentContents: 'Test Petitioner, Petitioner',
            documentTitle: 'Order',
            documentType: 'O - Order',
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
        formattedEventCode: 'O',
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
        formattedEventCode: 'OAPF',
        formattedFiledDate: '03/01/19',
        judge: 'Judge Cohen',
      },
    ]);
  });

  it('formats search results for an opinion search', () => {
    const result = runCompute(advancedDocumentSearchHelper, {
      state: {
        advancedSearchForm: { currentPage: 1 },
        searchResults: [
          {
            caseCaption: 'Test Petitioner, Petitioner',
            docketNumber: '101-19',
            docketNumberSuffix: 'Z',
            docketNumberWithSuffix: '101-19Z',
            documentContents: 'Test Petitioner, Petitioner',
            documentTitle: 'My Opinion',
            documentType: 'TCOP - T.C. Opinion',
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
            documentType: 'TCOP - T.C. Opinion',
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
        documentTitle: 'My Opinion',
        documentType: 'TCOP - T.C. Opinion',
        filingDate: '2019-03-01T05:00:00.000Z',
        formattedDocumentType: 'T.C. Opinion',
        formattedEventCode: 'TCOP',
        formattedFiledDate: '03/01/19',
        judge: 'Judge Buch',
      },
      {
        caseTitle: 'Test Petitioner',
        docketNumber: '102-19',
        docketNumberSuffix: 'P',
        docketNumberWithSuffix: '102-19P',
        documentContents: 'Test Petitioner, Petitioner',
        documentTitle: 'Opinion for Stuff',
        documentType: 'TCOP - T.C. Opinion',
        filingDate: '2019-03-01T05:00:00.000Z',
        formattedDocumentType: 'T.C. Opinion',
        formattedEventCode: 'TCOP',
        formattedFiledDate: '03/01/19',
        judge: 'Judge Cohen',
      },
    ]);
  });
});
