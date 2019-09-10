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
        constants: {
          CASE_SEARCH_PAGE_SIZE: CaseSearch.CASE_SEARCH_PAGE_SIZE,
          COUNTRY_TYPES: ContactFactory.COUNTRY_TYPES,
        },
        form: {},
      },
    });
    expect(result).toEqual({ showStateSelect: false });
  });

  it('returns showStateSelect true when state.form.countryType is "domestic"', () => {
    const result = runCompute(advancedSearchHelper, {
      state: {
        constants: {
          CASE_SEARCH_PAGE_SIZE: CaseSearch.CASE_SEARCH_PAGE_SIZE,
          COUNTRY_TYPES: ContactFactory.COUNTRY_TYPES,
        },
        form: { countryType: ContactFactory.COUNTRY_TYPES.DOMESTIC },
      },
    });
    expect(result).toEqual({ showStateSelect: true });
  });

  it('returns showStateSelect false when state.form.countryType is "international"', () => {
    const result = runCompute(advancedSearchHelper, {
      state: {
        constants: {
          CASE_SEARCH_PAGE_SIZE: CaseSearch.CASE_SEARCH_PAGE_SIZE,
          COUNTRY_TYPES: ContactFactory.COUNTRY_TYPES,
        },
        form: { countryType: ContactFactory.COUNTRY_TYPES.INTERNATIONAL },
      },
    });
    expect(result).toEqual({ showStateSelect: false });
  });

  it('returns showNoMatches true and showSearchResults false if searchResults is an empty array', () => {
    const result = runCompute(advancedSearchHelper, {
      state: {
        constants: {
          CASE_SEARCH_PAGE_SIZE: CaseSearch.CASE_SEARCH_PAGE_SIZE,
          COUNTRY_TYPES: ContactFactory.COUNTRY_TYPES,
          US_STATES: ContactFactory.US_STATES,
        },
        form: { currentPage: 1 },
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
        constants: {
          CASE_SEARCH_PAGE_SIZE: CaseSearch.CASE_SEARCH_PAGE_SIZE,
          COUNTRY_TYPES: ContactFactory.COUNTRY_TYPES,
          US_STATES: ContactFactory.US_STATES,
        },
        form: { currentPage: 1 },
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
        constants: {
          CASE_SEARCH_PAGE_SIZE: CaseSearch.CASE_SEARCH_PAGE_SIZE,
          COUNTRY_TYPES: ContactFactory.COUNTRY_TYPES,
          US_STATES: ContactFactory.US_STATES,
        },
        form: { currentPage: 1 },
        searchResults: [
          {
            caseCaption: 'Test Taxpayer, Petitioner',
            contactPrimary: { name: 'Test Person', state: 'TN' },
            docketNumber: '101-19',
            filedDate: '2019-03-01T05:00:00.000Z',
          },
          {
            caseCaption: 'Test Taxpayer & Another Taxpayer, Petitioner(s)',
            contactPrimary: { name: 'Test Person', state: 'TX' },
            contactSecondary: { name: 'Another Person', state: 'TX' },
            docketNumber: '102-18',
            docketNumberSuffix: 'W',
            filedDate: '2018-05-01T05:00:00.000Z',
          },
        ],
      },
    });
    expect(result.formattedSearchResults).toMatchObject([
      {
        caseCaptionNames: 'Test Taxpayer & Another Taxpayer',
        contactPrimaryName: 'Test Person',
        contactSecondaryName: 'Another Person',
        docketNumberWithSuffix: '102-18W',
        formattedFiledDate: '05/01/18',
        fullStateName: 'Texas',
      },
      {
        caseCaptionNames: 'Test Taxpayer',
        contactPrimaryName: 'Test Person',
        contactSecondaryName: undefined,
        docketNumberWithSuffix: '101-19',
        formattedFiledDate: '03/01/19',
        fullStateName: 'Tennessee',
      },
    ]);
  });

  it('only returns formatted results that should be currently shown based on form.currentPage', () => {
    let result = runCompute(advancedSearchHelper, {
      state: {
        constants: {
          CASE_SEARCH_PAGE_SIZE: 1,
          COUNTRY_TYPES: ContactFactory.COUNTRY_TYPES,
          US_STATES: ContactFactory.US_STATES,
        },
        form: { currentPage: 1 },
        searchResults: [
          {
            caseCaption: 'Test Taxpayer, Petitioner',
            contactPrimary: { name: 'Test Person', state: 'TN' },
            docketNumber: '101-19',
            filedDate: '2019-03-01T05:00:00.000Z',
          },
          {
            caseCaption: 'Test Taxpayer & Another Taxpayer, Petitioner(s)',
            contactPrimary: { name: 'Test Person', state: 'TX' },
            contactSecondary: { name: 'Another Person', state: 'TX' },
            docketNumber: '102-18',
            docketNumberSuffix: 'W',
            filedDate: '2018-05-01T05:00:00.000Z',
          },
        ],
      },
    });
    expect(result.showLoadMore).toEqual(true);
    expect(result.formattedSearchResults.length).toEqual(1);
    expect(result.formattedSearchResults).toMatchObject([
      {
        caseCaptionNames: 'Test Taxpayer & Another Taxpayer',
        contactPrimaryName: 'Test Person',
        contactSecondaryName: 'Another Person',
        docketNumberWithSuffix: '102-18W',
        formattedFiledDate: '05/01/18',
        fullStateName: 'Texas',
      },
    ]);

    result = runCompute(advancedSearchHelper, {
      state: {
        constants: {
          CASE_SEARCH_PAGE_SIZE: 1,
          COUNTRY_TYPES: ContactFactory.COUNTRY_TYPES,
          US_STATES: ContactFactory.US_STATES,
        },
        form: { currentPage: 2 },
        searchResults: [
          {
            caseCaption: 'Test Taxpayer, Petitioner',
            contactPrimary: { name: 'Test Person', state: 'TN' },
            docketNumber: '101-19',
            filedDate: '2019-03-01T05:00:00.000Z',
          },
          {
            caseCaption: 'Test Taxpayer & Another Taxpayer, Petitioner(s)',
            contactPrimary: { name: 'Test Person', state: 'TX' },
            contactSecondary: { name: 'Another Person', state: 'TX' },
            docketNumber: '102-18',
            docketNumberSuffix: 'W',
            filedDate: '2018-05-01T05:00:00.000Z',
          },
          {
            caseCaption: 'Test Petitioner & Another Petitioner, Petitioner(s)',
            contactPrimary: { name: 'Test Petitioner', state: 'CA' },
            contactSecondary: { name: 'Another Petitioner', state: 'TN' },
            docketNumber: '101-18',
            docketNumberSuffix: 'W',
            filedDate: '2018-04-01T05:00:00.000Z',
          },
        ],
      },
    });
    expect(result.showLoadMore).toEqual(false);
    expect(result.formattedSearchResults.length).toEqual(2);
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
        caseCaptionNames: 'Test Taxpayer & Another Taxpayer',
        contactPrimaryName: 'Test Person',
        contactSecondaryName: 'Another Person',
        docketNumberWithSuffix: '102-18W',
        formattedFiledDate: '05/01/18',
        fullStateNamePrimary: 'Texas',
      },
      {
        caseCaptionNames: 'Test Taxpayer',
        contactPrimaryName: 'Test Person',
        contactSecondaryName: undefined,
        docketNumberWithSuffix: '101-19',
        formattedFiledDate: '03/01/19',
        fullStateNamePrimary: 'Tennessee',
      },
    ]);
  });
});
