import { advancedSearchHelper as advancedSearchHelperComputed } from './advancedSearchHelper';
import { applicationContextForClient as applicationContext } from '../../../../../shared/src/business/test/createTestApplicationContext';
import { getUserPermissions } from '../../../../../shared/src/authorization/getUserPermissions';
import { runCompute } from 'cerebral/test';
import { withAppContextDecorator } from '../../../withAppContext';

describe('advancedSearchHelper', () => {
  const {
    COUNTRY_TYPES,
    DOCKET_NUMBER_SUFFIXES,
    USER_ROLES,
  } = applicationContext.getConstants();

  let pageSizeOverride = 5;
  let globalUser;

  const getBaseState = user => {
    globalUser = user;
    return {
      permissions: getUserPermissions(user),
    };
  };

  const advancedSearchHelper = withAppContextDecorator(
    advancedSearchHelperComputed,
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

  beforeEach(() => {
    globalUser = {
      role: USER_ROLES.docketClerk,
      userId: 'docketClerk',
    };
  });

  it('returns appropriate defaults if permissions are not defined in state', () => {
    const result = runCompute(advancedSearchHelper, {
      state: {
        advancedSearchForm: {},
      },
    });
    expect(result).toEqual({
      showPractitionerSearch: undefined,
      showStateSelect: false,
    });
  });

  it('returns only showStateSelect and showPractitionerSearch when searchResults is undefined', () => {
    const result = runCompute(advancedSearchHelper, {
      state: {
        ...getBaseState(globalUser),
        advancedSearchForm: {},
      },
    });
    expect(result).toEqual({
      showPractitionerSearch: true,
      showStateSelect: false,
    });
  });

  it('returns showPractitionerSearch false when user is an external user', () => {
    globalUser = {
      role: USER_ROLES.privatePractitioner,
      userId: 'practitioner',
    };

    const result = runCompute(advancedSearchHelper, {
      state: {
        ...getBaseState(globalUser),
        advancedSearchForm: {},
      },
    });
    expect(result).toMatchObject({
      showPractitionerSearch: false,
    });
  });

  it('returns showStateSelect true when state.advancedSearchForm.countryType is "domestic"', () => {
    const result = runCompute(advancedSearchHelper, {
      state: {
        ...getBaseState(globalUser),
        advancedSearchForm: {
          caseSearchByName: {
            countryType: COUNTRY_TYPES.DOMESTIC,
          },
        },
      },
    });
    expect(result).toEqual({
      showPractitionerSearch: true,
      showStateSelect: true,
    });
  });

  it('returns showStateSelect false when state.advancedSearchForm.countryType is "international"', () => {
    const result = runCompute(advancedSearchHelper, {
      state: {
        ...getBaseState(globalUser),
        advancedSearchForm: {
          caseSearchByName: {
            countryType: COUNTRY_TYPES.INTERNATIONAL,
          },
        },
      },
    });
    expect(result).toEqual({
      showPractitionerSearch: true,
      showStateSelect: false,
    });
  });

  it('returns showNoMatches true and showSearchResults false if searchResults is an empty array', () => {
    const result = runCompute(advancedSearchHelper, {
      state: {
        ...getBaseState(globalUser),
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

  it('returns showNoMatches false, showSearchResults true, and the results count if searchResults is an not empty array', () => {
    const result = runCompute(advancedSearchHelper, {
      state: {
        ...getBaseState(globalUser),
        advancedSearchForm: { currentPage: 1 },
        searchResults: [
          {
            contactPrimary: {
              name: 'Daenerys Stormborn',
              state: 'TN',
            },
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

  it('formats search results for a case search', () => {
    const result = runCompute(advancedSearchHelper, {
      state: {
        ...getBaseState(globalUser),
        advancedSearchForm: { currentPage: 1 },
        advancedSearchTab: 'case',
        searchResults: [
          {
            caseCaption: 'Test Petitioner, Petitioner',
            contactPrimary: {
              name: 'Daenerys Stormborn',
              state: 'TN',
            },
            docketNumber: '101-19',
            docketNumberWithSuffix: '101-19',
            receivedAt: '2019-03-01T05:00:00.000Z',
          },
          {
            caseCaption: 'Test Petitioner & Another Petitioner, Petitioner(s)',
            contactPrimary: {
              name: 'Daenerys Stormborn',
              state: 'TX',
            },
            contactSecondary: { name: 'Another Person', state: 'TX' },
            docketNumber: '102-18',
            docketNumberSuffix: DOCKET_NUMBER_SUFFIXES.WHISTLEBLOWER,
            docketNumberWithSuffix: '102-18W',
            receivedAt: '2019-05-01T05:00:00.000Z',
          },
        ],
      },
    });
    expect(result.formattedSearchResults).toMatchObject([
      {
        caseTitle: 'Test Petitioner',
        contactPrimaryName: 'Daenerys Stormborn',
        contactSecondaryName: undefined,
        docketNumberWithSuffix: '101-19',
        formattedFiledDate: '03/01/19',
        fullStateNamePrimary: 'Tennessee',
      },
      {
        caseTitle: 'Test Petitioner & Another Petitioner',
        contactPrimaryName: 'Daenerys Stormborn',
        contactSecondaryName: 'Another Person',
        docketNumberWithSuffix: '102-18W',
        formattedFiledDate: '05/01/19',
        fullStateNamePrimary: 'Texas',
      },
    ]);
  });

  it('only returns formatted results that should be currently shown based on form.currentPage for a case search', () => {
    pageSizeOverride = 1;
    let result = runCompute(advancedSearchHelper, {
      state: {
        ...getBaseState(globalUser),
        advancedSearchForm: { currentPage: 1 },
        advancedSearchTab: 'case',
        searchResults: [
          {
            caseCaption: 'Test Petitioner, Petitioner',
            contactPrimary: {
              name: 'Daenerys Stormborn',
              state: 'TN',
            },
            docketNumber: '101-19',
            docketNumberWithSuffix: '101-19',
            receivedAt: '2019-03-01T05:00:00.000Z',
          },
          {
            caseCaption: 'Test Petitioner & Another Petitioner, Petitioner(s)',
            contactPrimary: {
              name: 'Daenerys Stormborn',
              state: 'TX',
            },
            contactSecondary: { name: 'Another Person', state: 'TX' },
            docketNumber: '102-18',
            docketNumberSuffix: DOCKET_NUMBER_SUFFIXES.WHISTLEBLOWER,
            receivedAt: '2018-05-01T05:00:00.000Z',
          },
        ],
      },
    });
    expect(result.showLoadMore).toEqual(true);
    expect(result.formattedSearchResults.length).toEqual(1);
    expect(result.formattedSearchResults).toMatchObject([
      {
        caseTitle: 'Test Petitioner',
        contactPrimaryName: 'Daenerys Stormborn',
        docketNumberWithSuffix: '101-19',
        receivedAt: '2019-03-01T05:00:00.000Z',
      },
    ]);

    result = runCompute(advancedSearchHelper, {
      state: {
        ...getBaseState(globalUser),
        advancedSearchForm: { currentPage: 4 },
        advancedSearchTab: 'case',
        searchResults: [
          {
            caseCaption: 'Test Petitioner, Petitioner',
            contactPrimary: {
              name: 'Daenerys Stormborn',
              state: 'TN',
            },
            docketNumber: '101-19',
            docketNumberWithSuffix: '101-19',
            receivedAt: '2019-03-01T05:00:00.000Z',
          },
          {
            caseCaption: 'Test Petitioner & Another Petitioner, Petitioner(s)',
            contactPrimary: {
              name: 'Daenerys Stormborn',
              state: 'TX',
            },
            contactSecondary: { name: 'Another Person', state: 'TX' },
            docketNumber: '102-18',
            docketNumberSuffix: DOCKET_NUMBER_SUFFIXES.WHISTLEBLOWER,
            docketNumberWithSuffix: '102-18W',
            receivedAt: '2018-05-01T05:00:00.000Z',
          },
          {
            caseCaption: 'Test Petitioner & Another Petitioner, Petitioner(s)',
            contactPrimary: { name: 'Test Petitioner', state: 'CA' },
            contactSecondary: { name: 'Another Petitioner', state: 'TN' },
            docketNumber: '101-18',
            docketNumberSuffix: DOCKET_NUMBER_SUFFIXES.WHISTLEBLOWER,
            docketNumberWithSuffix: '101-18W',
            receivedAt: '2018-04-01T05:00:00.000Z',
          },
          {
            contactSecondary: { name: 'Another Person', state: 'AX' },
            docketNumber: '102-18',
            docketNumberSuffix: DOCKET_NUMBER_SUFFIXES.WHISTLEBLOWER,
            docketNumberWithSuffix: '102-18W',
            receivedAt: '2018-05-01T05:00:00.000Z',
          },
        ],
      },
    });
    expect(result.showLoadMore).toEqual(false);
    expect(result.formattedSearchResults.length).toEqual(4);
    expect(result.formattedSearchResults).toMatchObject([
      {
        caseTitle: 'Test Petitioner',
        contactPrimaryName: 'Daenerys Stormborn',
        contactSecondaryName: undefined,
        docketNumberWithSuffix: '101-19',
        formattedFiledDate: '03/01/19',
        fullStateNamePrimary: 'Tennessee',
      },
      {
        caseTitle: 'Test Petitioner & Another Petitioner',
        contactPrimaryName: 'Daenerys Stormborn',
        contactSecondaryName: 'Another Person',
        docketNumberWithSuffix: '102-18W',
        formattedFiledDate: '05/01/18',
        fullStateNamePrimary: 'Texas',
      },
      {
        caseTitle: 'Test Petitioner & Another Petitioner',
        contactPrimaryName: 'Test Petitioner',
        contactSecondaryName: 'Another Petitioner',
        docketNumberWithSuffix: '101-18W',
        formattedFiledDate: '04/01/18',
        fullStateNamePrimary: 'California',
        fullStateNameSecondary: 'Tennessee',
      },
      {
        caseTitle: '',
        contactPrimaryName: undefined,
        contactSecondaryName: 'Another Person',
        docketNumberWithSuffix: '102-18W',
        formattedFiledDate: '05/01/18',
        fullStateNamePrimary: undefined,
        fullStateNameSecondary: 'AX',
      },
    ]);
  });

  it('does not attempt to format results but only returns results that should be currently shown based on form.currentPage for a practitioner search', () => {
    pageSizeOverride = 1;

    let result = runCompute(advancedSearchHelper, {
      state: {
        ...getBaseState(globalUser),
        advancedSearchForm: { currentPage: 1 },
        advancedSearchTab: 'practitioner',
        searchResults: [{ barNumber: '1111' }, { barNumber: '2222' }],
      },
    });

    expect(result.showLoadMore).toEqual(true);
    expect(result.formattedSearchResults.length).toEqual(1);
    expect(result.formattedSearchResults).toMatchObject([
      { barNumber: '1111' },
    ]);

    pageSizeOverride = 3;

    result = runCompute(advancedSearchHelper, {
      state: {
        ...getBaseState(globalUser),
        advancedSearchForm: { currentPage: 1 },
        advancedSearchTab: 'practitioner',
        searchResults: [{ barNumber: '1111' }, { barNumber: '2222' }],
      },
    });

    expect(result.showLoadMore).toEqual(false);
    expect(result.formattedSearchResults.length).toEqual(2);
    expect(result.formattedSearchResults).toMatchObject([
      { barNumber: '1111' },
      { barNumber: '2222' },
    ]);
  });
});
