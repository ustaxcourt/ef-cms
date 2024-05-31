import { applicationContextForClient as applicationContext } from '@web-client/test/createClientTestApplicationContext';
import { getUserPermissions } from '../../../../../shared/src/authorization/getUserPermissions';
import { practitionerSearchHelper as practitionerSearchHelperComputed } from './practitionerSearchHelper';
import { runCompute } from '@web-client/presenter/test.cerebral';
import { withAppContextDecorator } from '../../../withAppContext';

describe('practitionerSearchHelper', () => {
  const { USER_ROLES } = applicationContext.getConstants();

  let pageSizeOverride = 5;
  let globalUser;

  const getBaseState = user => {
    return {
      permissions: getUserPermissions(user),
    };
  };

  const practitionerSearchHelper = withAppContextDecorator(
    practitionerSearchHelperComputed,
    {
      ...applicationContext,
      getConstants: () => {
        return {
          ...applicationContext.getConstants(),
          PRACTITIONER_SEARCH_PAGE_SIZE: pageSizeOverride,
        };
      },
      getCurrentUser: () => {
        return globalUser;
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

  const defaultResult = {
    activePage: 0,
    formattedSearchResults: [],
    numberOfResults: '0',
    pageCount: 0,
    pageSize: 0,
    showNoMatches: false,
    showPaginator: false,
    showSearchResults: false,
  };

  beforeEach(() => {
    globalUser = {
      role: USER_ROLES.docketClerk,
      userId: 'docketClerk',
    };
  });

  it('returns default search results when searchResults is undefined (when the search has never been run)', () => {
    const result = runCompute(practitionerSearchHelper, {
      state: {
        ...getBaseState(globalUser),
        advancedSearchForm: {},
        advancedSearchTab: 'practitioner',
      },
    });
    expect(result).toEqual(defaultResult);
  });

  it('returns showNoMatches true and showSearchResults false if searchResults comes up empty', () => {
    const result = runCompute(practitionerSearchHelper, {
      state: {
        ...getBaseState(globalUser),
        advancedSearchForm: { currentPage: 1 },
        advancedSearchTab: 'practitioner',
        searchResults: { practitioner: [] },
      },
    });
    expect(result).toMatchObject({
      ...defaultResult,
      showNoMatches: true,
      showSearchResults: false,
    });
  });

  it('should format the count if total is over 999', () => {
    const result = runCompute(practitionerSearchHelper, {
      state: {
        ...getBaseState(globalUser),
        advancedSearchForm: { practitionerSearchByName: { pageNum: 1 } },
        advancedSearchTab: 'practitioner',
        searchResults: {
          practitioner: { practitioners: [], total: 1234 },
        },
      },
    });
    expect(result).toMatchObject({
      activePage: 1,
      numberOfResults: '1,234',
      showPaginator: true,
    });
  });

  it('returns showNoMatches false, showSearchResults true, and the results count if searchResults is an not empty array', () => {
    const result = runCompute(practitionerSearchHelper, {
      state: {
        ...getBaseState(globalUser),
        advancedSearchForm: { currentPage: 1 },
        advancedSearchTab: 'practitioner',
        searchResults: {
          practitioner: {
            practitioners: [
              {
                name: 'cinco de mayo',
              },
            ],
            total: 1,
          },
        },
      },
    });
    expect(result).toMatchObject({
      numberOfResults: '1',
      pageCount: 1,
      showNoMatches: false,
      showPaginator: false,
      showSearchResults: true,
    });
  });

  describe('practitioner search', () => {
    it('formats results that should be currently shown based on form.currentPage for a practitioner search', () => {
      let result = runCompute(practitionerSearchHelper, {
        state: {
          ...getBaseState(globalUser),
          advancedSearchForm: { currentPage: 1 },
          advancedSearchTab: 'practitioner',
          searchResults: {
            practitioner: {
              practitioners: [
                {
                  admissionsDate: '2012-03-13',
                  barNumber: '1111',
                  contact: { state: 'WA' },
                  name: 'pablo escobar',
                  petitioners: [mockPetitionerOne],
                },
                {
                  admissionsDate: '1980-02-03',
                  barNumber: '2222',
                  contact: { state: 'Hawaii' },
                  formattedAdmissionsDate: '02/03/1980',
                  name: 'ricardo diaz',
                  petitioners: [{ ...mockPetitionerTwo, state: 'Alabama' }],
                },
              ],
              total: 2,
            },
          },
        },
      });

      expect(result.formattedSearchResults.length).toEqual(2);
      expect(result.formattedSearchResults).toEqual([
        {
          admissionsDate: '2012-03-13',
          barNumber: '1111',
          contact: { state: 'WA', stateFullName: 'Washington' },
          formattedAdmissionsDate: '03/13/2012',
          name: 'pablo escobar',
          petitionerFullStateNames: [
            {
              contactId: mockPetitionerOne.contactId,
              state: 'Tennessee',
            },
          ],
          petitioners: [mockPetitionerOne],
        },
        {
          admissionsDate: '1980-02-03',
          barNumber: '2222',
          contact: { state: 'Hawaii', stateFullName: 'Hawaii' },
          formattedAdmissionsDate: '02/03/1980',
          name: 'ricardo diaz',
          petitionerFullStateNames: [
            {
              contactId: mockPetitionerTwo.contactId,
              state: 'Alabama',
            },
          ],
          petitioners: [{ ...mockPetitionerTwo, state: 'Alabama' }],
        },
      ]);
    });

    it('sorts practitioner results based on name and then by bar number if name is identical', () => {
      let result = runCompute(practitionerSearchHelper, {
        state: {
          ...getBaseState(globalUser),
          advancedSearchForm: { currentPage: 1 },
          advancedSearchTab: 'practitioner',
          searchResults: {
            practitioner: {
              practitioners: [
                { barNumber: '1111', name: 'pablo escobar' },
                { barNumber: '2222', name: 'some guy' },
              ],
              total: 2,
            },
          },
        },
      });

      expect(result.formattedSearchResults).toEqual([
        {
          barNumber: '1111',
          formattedAdmissionsDate: '',
          name: 'pablo escobar',
        },
        { barNumber: '2222', formattedAdmissionsDate: '', name: 'some guy' },
      ]);
    });
  });
});
