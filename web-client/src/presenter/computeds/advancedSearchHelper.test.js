import { CaseSearch } from '../../../../shared/src/business/entities/cases/CaseSearch';
import { ContactFactory } from '../../../../shared/src/business/entities/contacts/ContactFactory';
import { advancedSearchHelper as advancedSearchHelperComputed } from './advancedSearchHelper';
import { runCompute } from 'cerebral/test';
import { withAppContextDecorator } from '../../withAppContext';

const advancedSearchHelper = withAppContextDecorator(
  advancedSearchHelperComputed,
);

describe('advancedSearchHelper', () => {
  it('returns only showStateSelect when searchResults is undefined', () => {
    const result = runCompute(advancedSearchHelper, {
      state: {
        advancedSearchForm: {},
        constants: {
          CASE_SEARCH_PAGE_SIZE: CaseSearch.CASE_SEARCH_PAGE_SIZE,
          COUNTRY_TYPES: ContactFactory.COUNTRY_TYPES,
        },
      },
    });
    expect(result).toEqual({ showStateSelect: false });
  });

  it('returns showStateSelect true when state.advancedSearchForm.countryType is "domestic"', () => {
    const result = runCompute(advancedSearchHelper, {
      state: {
        advancedSearchForm: {
          countryType: ContactFactory.COUNTRY_TYPES.DOMESTIC,
        },
        constants: {
          CASE_SEARCH_PAGE_SIZE: CaseSearch.CASE_SEARCH_PAGE_SIZE,
          COUNTRY_TYPES: ContactFactory.COUNTRY_TYPES,
        },
      },
    });
    expect(result).toEqual({ showStateSelect: true });
  });

  it('returns showStateSelect false when state.advancedSearchForm.countryType is "international"', () => {
    const result = runCompute(advancedSearchHelper, {
      state: {
        advancedSearchForm: {
          countryType: ContactFactory.COUNTRY_TYPES.INTERNATIONAL,
        },
        constants: {
          CASE_SEARCH_PAGE_SIZE: CaseSearch.CASE_SEARCH_PAGE_SIZE,
          COUNTRY_TYPES: ContactFactory.COUNTRY_TYPES,
        },
      },
    });
    expect(result).toEqual({ showStateSelect: false });
  });

  it('returns showNoMatches true and showSearchResults false if searchResults is an empty array', () => {
    const result = runCompute(advancedSearchHelper, {
      state: {
        advancedSearchForm: { currentPage: 1 },
        constants: {
          CASE_SEARCH_PAGE_SIZE: CaseSearch.CASE_SEARCH_PAGE_SIZE,
          COUNTRY_TYPES: ContactFactory.COUNTRY_TYPES,
          US_STATES: ContactFactory.US_STATES,
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

  it('returns showNoMatches false, showSearchResults true, and the results count if searchResults is an not empty array', () => {
    const result = runCompute(advancedSearchHelper, {
      state: {
        advancedSearchForm: { currentPage: 1 },
        constants: {
          CASE_SEARCH_PAGE_SIZE: CaseSearch.CASE_SEARCH_PAGE_SIZE,
          COUNTRY_TYPES: ContactFactory.COUNTRY_TYPES,
          US_STATES: ContactFactory.US_STATES,
        },
        searchResults: [
          {
            contactPrimary: { name: 'Test Person', state: 'TN' },
            docketNumber: '101-19',
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

  it('formats search results and sorts by docket number', () => {
    const result = runCompute(advancedSearchHelper, {
      state: {
        advancedSearchForm: { currentPage: 1 },
        constants: {
          CASE_SEARCH_PAGE_SIZE: CaseSearch.CASE_SEARCH_PAGE_SIZE,
          COUNTRY_TYPES: ContactFactory.COUNTRY_TYPES,
          US_STATES: ContactFactory.US_STATES,
        },
        searchResults: [
          {
            caseCaption: 'Test Petitioner, Petitioner',
            contactPrimary: { name: 'Test Person', state: 'TN' },
            docketNumber: '101-19',
            receivedAt: '2019-03-01T05:00:00.000Z',
          },
          {
            caseCaption: 'Test Petitioner & Another Petitioner, Petitioner(s)',
            contactPrimary: { name: 'Test Person', state: 'TX' },
            contactSecondary: { name: 'Another Person', state: 'TX' },
            docketNumber: '102-18',
            docketNumberSuffix: 'W',
            receivedAt: '2019-05-01T05:00:00.000Z',
            receivedAt: '2018-05-01T05:00:00.000Z',
          },
        ],
      },
    });
    expect(result.formattedSearchResults).toMatchObject([
      {
        caseCaptionNames: 'Test Petitioner & Another Petitioner',
        contactPrimaryName: 'Test Person',
        contactSecondaryName: 'Another Person',
        docketNumberWithSuffix: '102-18W',
        formattedFiledDate: '05/01/18',
        fullStateNamePrimary: 'Texas',
      },
      {
        caseCaptionNames: 'Test Petitioner',
        contactPrimaryName: 'Test Person',
        contactSecondaryName: undefined,
        docketNumberWithSuffix: '101-19',
        formattedFiledDate: '03/01/19',
        fullStateNamePrimary: 'Tennessee',
      },
    ]);
  });

  it('only returns formatted results that should be currently shown based on form.currentPage', () => {
    let result = runCompute(advancedSearchHelper, {
      state: {
        advancedSearchForm: { currentPage: 1 },
        constants: {
          CASE_SEARCH_PAGE_SIZE: 1,
          COUNTRY_TYPES: ContactFactory.COUNTRY_TYPES,
          US_STATES: ContactFactory.US_STATES,
        },
        searchResults: [
          {
            caseCaption: 'Test Petitioner, Petitioner',
            contactPrimary: { name: 'Test Person', state: 'TN' },
            docketNumber: '101-19',
            receivedAt: '2019-03-01T05:00:00.000Z',
          },
          {
            caseCaption: 'Test Petitioner & Another Petitioner, Petitioner(s)',
            contactPrimary: { name: 'Test Person', state: 'TX' },
            contactSecondary: { name: 'Another Person', state: 'TX' },
            docketNumber: '102-18',
            docketNumberSuffix: 'W',
            receivedAt: '2018-05-01T05:00:00.000Z',
          },
        ],
      },
    });
    expect(result.showLoadMore).toEqual(true);
    expect(result.formattedSearchResults.length).toEqual(1);
    expect(result.formattedSearchResults).toMatchObject([
      {
        caseCaptionNames: 'Test Petitioner & Another Petitioner',
        contactPrimaryName: 'Test Person',
        contactSecondaryName: 'Another Person',
        docketNumberWithSuffix: '102-18W',
        formattedFiledDate: '05/01/18',
        fullStateNamePrimary: 'Texas',
      },
    ]);

    result = runCompute(advancedSearchHelper, {
      state: {
        advancedSearchForm: { currentPage: 3 },
        constants: {
          CASE_SEARCH_PAGE_SIZE: 1,
          COUNTRY_TYPES: ContactFactory.COUNTRY_TYPES,
          US_STATES: ContactFactory.US_STATES,
        },
        searchResults: [
          {
            caseCaption: 'Test Petitioner, Petitioner',
            contactPrimary: { name: 'Test Person', state: 'TN' },
            docketNumber: '101-19',
            receivedAt: '2019-03-01T05:00:00.000Z',
          },
          {
            caseCaption: 'Test Petitioner & Another Petitioner, Petitioner(s)',
            contactPrimary: { name: 'Test Person', state: 'TX' },
            contactSecondary: { name: 'Another Person', state: 'TX' },
            docketNumber: '102-18',
            docketNumberSuffix: 'W',
            receivedAt: '2018-05-01T05:00:00.000Z',
          },
          {
            caseCaption: 'Test Petitioner & Another Petitioner, Petitioner(s)',
            contactPrimary: { name: 'Test Petitioner', state: 'CA' },
            contactSecondary: { name: 'Another Petitioner', state: 'TN' },
            docketNumber: '101-18',
            docketNumberSuffix: 'W',
            receivedAt: '2018-04-01T05:00:00.000Z',
          },
        ],
      },
    });
    expect(result.showLoadMore).toEqual(false);
    expect(result.formattedSearchResults.length).toEqual(3);
    expect(result.formattedSearchResults).toMatchObject([
      {
        caseCaptionNames: 'Test Petitioner & Another Petitioner',
        contactPrimaryName: 'Test Petitioner',
        contactSecondaryName: 'Another Petitioner',
        docketNumberWithSuffix: '101-18W',
        formattedFiledDate: '04/01/18',
        fullStateNamePrimary: 'California',
        fullStateNameSecondary: 'Tennessee',
      },
      {
        caseCaptionNames: 'Test Petitioner & Another Petitioner',
        contactPrimaryName: 'Test Person',
        contactSecondaryName: 'Another Person',
        docketNumberWithSuffix: '102-18W',
        formattedFiledDate: '05/01/18',
        fullStateNamePrimary: 'Texas',
      },
      {
        caseCaptionNames: 'Test Petitioner',
        contactPrimaryName: 'Test Person',
        contactSecondaryName: undefined,
        docketNumberWithSuffix: '101-19',
        formattedFiledDate: '03/01/19',
        fullStateNamePrimary: 'Tennessee',
      },
    ]);
  });
});
