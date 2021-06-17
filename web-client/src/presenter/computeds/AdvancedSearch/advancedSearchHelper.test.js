import {
  advancedSearchHelper as advancedSearchHelperComputed,
  paginationHelper,
} from './advancedSearchHelper';
import { applicationContextForClient as applicationContext } from '../../../../../shared/src/business/test/createTestApplicationContext';
import { getUserPermissions } from '../../../../../shared/src/authorization/getUserPermissions';
import { runCompute } from 'cerebral/test';
import { withAppContextDecorator } from '../../../withAppContext';

describe('advancedSearchHelper', () => {
  const { COUNTRY_TYPES, DOCKET_NUMBER_SUFFIXES, US_STATES, USER_ROLES } =
    applicationContext.getConstants();

  const maxSearchResultsOverride = 3;
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
          MAX_SEARCH_RESULTS: maxSearchResultsOverride,
        };
      },
    },
  );

  const mockPetitionerOne = {
    contactId: '4572d453-fae3-44c8-a298-254cc0eb43cd',
    name: 'Daenerys Stormborn',
    state: 'TN',
  };
  const mockPetitionerTwo = {
    contactId: '52f678c6-ba27-4c64-9479-10604684dc7a',
    name: 'Another Person',
    state: 'TX',
  };

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
        searchResults: { case: [] },
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
        searchResults: {
          case: [
            {
              docketNumber: '101-19',
              petitioners: [mockPetitionerOne],
            },
          ],
        },
      },
    });
    expect(result).toMatchObject({
      searchResultsCount: 1,
      showLoadMore: false,
      showNoMatches: false,
      showSearchResults: true,
    });
    expect(result.showManyResultsMessage).toBeFalsy();
  });

  it('formats search results for a case search', () => {
    const result = runCompute(advancedSearchHelper, {
      state: {
        ...getBaseState(globalUser),
        advancedSearchForm: { currentPage: 1 },
        advancedSearchTab: 'case',
        searchResults: {
          case: [
            {
              caseCaption: 'Test Petitioner, Petitioner',
              docketNumber: '101-19',
              docketNumberWithSuffix: '101-19',
              petitioners: [mockPetitionerOne],
              receivedAt: '2019-03-01T05:00:00.000Z',
            },
            {
              caseCaption:
                'Test Petitioner & Another Petitioner, Petitioner(s)',
              docketNumber: '102-18',
              docketNumberSuffix: DOCKET_NUMBER_SUFFIXES.WHISTLEBLOWER,
              docketNumberWithSuffix: '102-18W',
              petitioners: [mockPetitionerOne, mockPetitionerTwo],
              receivedAt: '2019-05-01T05:00:00.000Z',
            },
          ],
        },
      },
    });
    expect(result.numberOfResults).toEqual(2);
    expect(result.formattedSearchResults).toMatchObject([
      {
        caseTitle: 'Test Petitioner',
        docketNumberWithSuffix: '101-19',
        formattedFiledDate: '03/01/19',
        petitionerFullStateNames: [
          { contactId: mockPetitionerOne.contactId, state: US_STATES.TN },
        ],
      },
      {
        caseTitle: 'Test Petitioner & Another Petitioner',
        docketNumberWithSuffix: '102-18W',
        formattedFiledDate: '05/01/19',
        petitionerFullStateNames: [
          {
            contactId: mockPetitionerOne.contactId,
            state: US_STATES.TN,
          },
          {
            contactId: mockPetitionerTwo.contactId,
            state: US_STATES.TX,
          },
        ],
      },
    ]);
  });

  it(`shows warning of maximum (${maxSearchResultsOverride}) search results if threshold is reached`, () => {
    const result = runCompute(advancedSearchHelper, {
      state: {
        ...getBaseState(globalUser),
        advancedSearchForm: { currentPage: 1 },
        advancedSearchTab: 'case',
        searchResults: {
          case: [
            {
              caseCaption: 'Test Petitioner, Petitioner',
              docketNumber: '101-19',
              docketNumberWithSuffix: '101-19',
              petitioners: [mockPetitionerOne],
              receivedAt: '2019-03-01T05:00:00.000Z',
            },
            {
              caseCaption:
                'Test Petitioner & Another Petitioner, Petitioner(s)',
              docketNumber: '102-18',
              docketNumberSuffix: DOCKET_NUMBER_SUFFIXES.WHISTLEBLOWER,
              docketNumberWithSuffix: '102-18W',
              petitioners: [mockPetitionerOne, mockPetitionerTwo],
              receivedAt: '2019-05-01T05:00:00.000Z',
            },
            {
              caseCaption: 'Test Petitioner, Petitioner',
              docketNumber: '103-19',
              docketNumberWithSuffix: '103-19',
              petitioners: [mockPetitionerOne],
              receivedAt: '2019-03-01T05:00:00.000Z',
            },
            {
              caseCaption:
                'Test Petitioner & Another Petitioner, Petitioner(s)',
              docketNumber: '104-18',
              docketNumberSuffix: DOCKET_NUMBER_SUFFIXES.WHISTLEBLOWER,
              docketNumberWithSuffix: '104-18W',
              petitioners: [mockPetitionerOne, mockPetitionerTwo],
              receivedAt: '2019-05-01T05:00:00.000Z',
            },
          ],
        },
      },
    });
    expect(result.showManyResultsMessage).toBe(true);
    expect(result.manyResults).toBeDefined();
  });

  it('only returns formatted results that should be currently shown based on form.currentPage for a case search', () => {
    pageSizeOverride = 1;
    let result = runCompute(advancedSearchHelper, {
      state: {
        ...getBaseState(globalUser),
        advancedSearchForm: { currentPage: 1 },
        advancedSearchTab: 'case',
        searchResults: {
          case: [
            {
              caseCaption: 'Test Petitioner, Petitioner',
              docketNumber: '101-19',
              docketNumberWithSuffix: '101-19',
              petitioners: [mockPetitionerOne],
              receivedAt: '2019-03-01T05:00:00.000Z',
            },
            {
              caseCaption:
                'Test Petitioner & Another Petitioner, Petitioner(s)',
              docketNumber: '102-18',
              docketNumberSuffix: DOCKET_NUMBER_SUFFIXES.WHISTLEBLOWER,
              petitioners: [mockPetitionerOne, mockPetitionerTwo],
              receivedAt: '2018-05-01T05:00:00.000Z',
            },
          ],
        },
      },
    });
    expect(result.showLoadMore).toEqual(true);
    expect(result.formattedSearchResults.length).toEqual(1);
    expect(result.formattedSearchResults).toMatchObject([
      {
        caseTitle: 'Test Petitioner',
        docketNumberWithSuffix: '101-19',
        receivedAt: '2019-03-01T05:00:00.000Z',
      },
    ]);

    result = runCompute(advancedSearchHelper, {
      state: {
        ...getBaseState(globalUser),
        advancedSearchForm: { currentPage: 4 },
        advancedSearchTab: 'case',
        searchResults: {
          case: [
            {
              caseCaption: 'Test Petitioner, Petitioner',
              docketNumber: '101-19',
              docketNumberWithSuffix: '101-19',
              petitioners: [mockPetitionerOne],
              receivedAt: '2019-03-01T05:00:00.000Z',
            },
            {
              caseCaption:
                'Test Petitioner & Another Petitioner, Petitioner(s)',
              docketNumber: '102-18',
              docketNumberSuffix: DOCKET_NUMBER_SUFFIXES.WHISTLEBLOWER,
              docketNumberWithSuffix: '102-18W',
              petitioners: [mockPetitionerOne, mockPetitionerTwo],
              receivedAt: '2018-05-01T05:00:00.000Z',
            },
            {
              caseCaption:
                'Test Petitioner & Another Petitioner, Petitioner(s)',
              docketNumber: '101-18',
              docketNumberSuffix: DOCKET_NUMBER_SUFFIXES.WHISTLEBLOWER,
              docketNumberWithSuffix: '101-18W',
              petitioners: [
                {
                  ...mockPetitionerOne,
                  state: 'CA',
                },
                {
                  ...mockPetitionerTwo,
                  state: 'TN',
                },
              ],
              receivedAt: '2018-04-01T05:00:00.000Z',
            },
            {
              docketNumber: '102-18',
              docketNumberSuffix: DOCKET_NUMBER_SUFFIXES.WHISTLEBLOWER,
              docketNumberWithSuffix: '102-18W',
              petitioners: [
                {
                  ...mockPetitionerOne,
                  state: 'AX',
                },
              ],
              receivedAt: '2018-05-01T05:00:00.000Z',
            },
          ],
        },
      },
    });
    expect(result.showLoadMore).toEqual(false);
    expect(result.formattedSearchResults.length).toEqual(4);
    expect(result.formattedSearchResults).toMatchObject([
      {
        caseTitle: 'Test Petitioner',
        docketNumberWithSuffix: '101-19',
        formattedFiledDate: '03/01/19',
        petitionerFullStateNames: [
          { contactId: mockPetitionerOne.contactId, state: US_STATES.TN },
        ],
      },
      {
        caseTitle: 'Test Petitioner & Another Petitioner',
        docketNumberWithSuffix: '102-18W',
        formattedFiledDate: '05/01/18',
        petitionerFullStateNames: [
          { contactId: mockPetitionerOne.contactId, state: US_STATES.TN },
          { contactId: mockPetitionerTwo.contactId, state: US_STATES.TX },
        ],
      },
      {
        caseTitle: 'Test Petitioner & Another Petitioner',
        docketNumberWithSuffix: '101-18W',
        formattedFiledDate: '04/01/18',
        petitionerFullStateNames: [
          { contactId: mockPetitionerOne.contactId, state: US_STATES.CA },
          { contactId: mockPetitionerTwo.contactId, state: US_STATES.TN },
        ],
      },
      {
        caseTitle: '',
        docketNumberWithSuffix: '102-18W',
        formattedFiledDate: '05/01/18',
        petitionerFullStateNames: [
          { contactId: mockPetitionerOne.contactId, state: 'AX' },
        ],
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
        searchResults: {
          practitioner: [{ barNumber: '1111' }, { barNumber: '2222' }],
        },
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
        searchResults: {
          practitioner: [{ barNumber: '1111' }, { barNumber: '2222' }],
        },
      },
    });

    expect(result.showLoadMore).toEqual(false);
    expect(result.formattedSearchResults.length).toEqual(2);
    expect(result.formattedSearchResults).toMatchObject([
      { barNumber: '1111' },
      { barNumber: '2222' },
    ]);
  });

  describe('paginationHelper', () => {
    it('should return an empty object when searchResults are undefined', () => {
      const result = paginationHelper(undefined, 1, 25);

      expect(result).toEqual({});
    });
  });
});
