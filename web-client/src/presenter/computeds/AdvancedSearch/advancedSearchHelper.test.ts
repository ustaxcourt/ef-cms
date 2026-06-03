import {
  advancedSearchHelper as advancedSearchHelperComputed,
  paginationHelper,
} from './advancedSearchHelper';
import { applicationContextForClient as applicationContext } from '@web-client/test/createClientTestApplicationContext';
import { docketClerk1User } from '@shared/test/mockUsers';
import { getUserPermissions } from '@web-client/authorization/getUserPermissions';
import { runCompute } from '@web-client/presenter/test.cerebral';
import { withAppContextDecorator } from '../../../withAppContext';

describe('advancedSearchHelper', () => {
  const { COUNTRY_TYPES, DOCKET_NUMBER_SUFFIXES, US_STATES, USER_ROLES } =
    applicationContext.getConstants();

  let globalUser;

  const getBaseState = user => {
    return {
      permissions: getUserPermissions(user),
      user,
    };
  };

  const advancedSearchHelper = withAppContextDecorator(
    advancedSearchHelperComputed,
    {
      ...applicationContext,
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
    globalUser = docketClerk1User;
  });

  it('returns appropriate defaults if permissions are not defined in state', () => {
    const result = runCompute(advancedSearchHelper, {
      state: {
        advancedSearchForm: {},
        advancedSearchTab: 'case',
      },
    });
    expect(result).toEqual({
      showPractitionerSearch: undefined,
      showStateSelect: false,
    });
  });

  it('does not return search results when searchResults is undefined', () => {
    const result = runCompute(advancedSearchHelper, {
      state: {
        ...getBaseState(globalUser),
        advancedSearchForm: {},
        advancedSearchTab: 'case',
      },
    });
    expect(result).toEqual({
      showPractitionerSearch: true,
      showStateSelect: false,
    });
  });

  it('returns showPractitionerSearch false when user is an external user', () => {
    globalUser = {
      advancedSearchTab: 'case',
      role: USER_ROLES.privatePractitioner,
      userId: 'practitioner',
    };

    const result = runCompute(advancedSearchHelper, {
      state: {
        ...getBaseState(globalUser),
        advancedSearchForm: {},
        advancedSearchTab: 'case',
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
        advancedSearchTab: 'case',
      },
    });
    expect(result).toMatchObject({
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
        advancedSearchTab: 'case',
      },
    });
    expect(result).toMatchObject({
      showPractitionerSearch: true,
      showStateSelect: false,
    });
  });

  it('returns showNoMatches true and showSearchResults false if searchResults is an empty array', () => {
    const result = runCompute(advancedSearchHelper, {
      state: {
        ...getBaseState(globalUser),
        advancedSearchForm: { currentPage: 1 },
        advancedSearchTab: 'case',
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
        advancedSearchTab: 'case',
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
          { contactId: mockPetitionerOne.contactId, state: US_STATES.TN },
          { contactId: mockPetitionerTwo.contactId, state: US_STATES.TX },
        ],
      },
    ]);
  });

  it('shows warning of maximum search results if threshold is reached', () => {
    const actualMax =
      applicationContext.getConstants().MAX_DOCUMENT_SEARCH_RESULTS;
    const resultsAtThreshold = Array.from({ length: actualMax }, (_, i) => ({
      docketNumber: `${i + 1}-19`,
      petitioners: [mockPetitionerOne],
    }));

    const result = runCompute(advancedSearchHelper, {
      state: {
        ...getBaseState(globalUser),
        advancedSearchForm: { currentPage: 1 },
        advancedSearchTab: 'case',
        searchResults: { case: resultsAtThreshold },
      },
    });

    expect(result.showManyResultsMessage).toBe(true);
    expect(result.manyResults).toBeDefined();
  });

  it('returns all formatted results regardless of currentPage since load more is removed', () => {
    const searchResultsData = [
      {
        caseCaption: 'Test Petitioner, Petitioner',
        docketNumber: '101-19',
        docketNumberWithSuffix: '101-19',
        petitioners: [mockPetitionerOne],
        receivedAt: '2019-03-01T05:00:00.000Z',
      },
      {
        caseCaption: 'Test Petitioner & Another Petitioner, Petitioner(s)',
        docketNumber: '102-18',
        docketNumberSuffix: DOCKET_NUMBER_SUFFIXES.WHISTLEBLOWER,
        docketNumberWithSuffix: '102-18W',
        petitioners: [mockPetitionerOne, mockPetitionerTwo],
        receivedAt: '2018-05-01T05:00:00.000Z',
      },
    ];

    const result = runCompute(advancedSearchHelper, {
      state: {
        ...getBaseState(globalUser),
        advancedSearchForm: { currentPage: 1 },
        advancedSearchTab: 'case',
        searchResults: { case: searchResultsData },
      },
    });

    expect(result.showLoadMore).toEqual(false);
    expect(result.formattedSearchResults.length).toEqual(2);
  });

  it('should return without formatting if on the practitioner tab', () => {
    const initialState = {
      ...getBaseState(globalUser),
      advancedSearchForm: { currentPage: 1 },
      advancedSearchTab: 'practitioner',
      searchResults: {
        practitioner: [
          {
            admissionsDate: '2012-03-13',
            barNumber: '1111',
            contact: { state: 'WA' },
            name: 'pablo escobar',
          },
          { barNumber: '2222', name: 'ricardo diaz' },
        ],
      },
    };
    const result = runCompute(advancedSearchHelper, {
      state: initialState,
    });
    expect(result).toMatchObject({
      showPractitionerSearch: true,
      showStateSelect: false,
    });
  });

  describe('paginationHelper', () => {
    it('should return an empty object when searchResults are undefined', () => {
      const result = paginationHelper(undefined, 1, 25);
      expect(result).toEqual({});
    });
  });
});
