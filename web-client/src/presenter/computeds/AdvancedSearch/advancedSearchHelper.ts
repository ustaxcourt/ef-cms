import { ClientApplicationContext } from '@web-client/applicationContext';
import { Get } from 'cerebral';
import { compareStrings } from '../../../../../shared/src/business/utilities/sortFunctions';
import { state } from '@web-client/presenter/app.cerebral';

export type PractitionerSearchResultType = {
  admissionsStatus: string;
  admissionsDate: string;
  barNumber: string;
  contact?: { state: string };
  formattedAdmissionsDate: string;
  name: string;
  practiceType: string;
  practitionerType: string;
  state?: string;
  stateFullName?: string;
};

export const formatSearchResultRecord = (
  result,
  { applicationContext }: { applicationContext: ClientApplicationContext },
) => {
  const { US_STATES } = applicationContext.getConstants();

  result.formattedFiledDate = applicationContext
    .getUtilities()
    .formatDateString(result.receivedAt, 'MMDDYY');

  result.caseTitle = applicationContext.getCaseTitle(result.caseCaption || '');

  if (result.petitioners) {
    result.petitionerFullStateNames = result.petitioners.map(petitioner => {
      return {
        contactId: petitioner.contactId,
        state: US_STATES[petitioner.state] || petitioner.state,
      };
    });
  }

  return result;
};

export const formatPractitionerSearchResultRecord = (
  result,
  { applicationContext }: { applicationContext: ClientApplicationContext },
): PractitionerSearchResultType => {
  if (result.contact?.state) {
    const { US_STATES } = applicationContext.getConstants();
    result.contact.stateFullName =
      US_STATES[result.contact.state] || result.contact.state;
  }

  result.formattedAdmissionsDate = applicationContext
    .getUtilities()
    .formatDateString(result.admissionsDate, 'MMDDYYYY');

  return result;
};

export const advancedSearchHelper = (
  get: Get,
  applicationContext: ClientApplicationContext,
): any => {
  const permissions = get(state.permissions);
  const countryType = get(
    state.advancedSearchForm.caseSearchByName.countryType,
  );
  const { CASE_SEARCH_PAGE_SIZE, COUNTRY_TYPES } =
    applicationContext.getConstants();

  const advancedSearchTab = get(state.advancedSearchTab);
  const searchResults = get(state.searchResults[advancedSearchTab]);
  const currentPage = get(state.advancedSearchForm.currentPage);

  const result = {
    showPractitionerSearch: permissions?.MANAGE_PRACTITIONER_USERS,
    showStateSelect: countryType === COUNTRY_TYPES.DOMESTIC,
  };

  if (searchResults) {
    const paginatedResults = paginationHelper(
      searchResults,
      currentPage,
      CASE_SEARCH_PAGE_SIZE,
    );

    if (advancedSearchTab === 'case') {
      paginatedResults.formattedSearchResults =
        paginatedResults.searchResults.map(searchResult =>
          formatSearchResultRecord(searchResult, { applicationContext }),
        );
    } else if (advancedSearchTab === 'practitioner') {
      // extract this to a separate function?
      paginatedResults.formattedSearchResults =
        paginatedResults.searchResults.map(searchResult =>
          formatPractitionerSearchResultRecord(searchResult, {
            applicationContext,
          }),
        );

      if (paginatedResults.formattedSearchResults!.length > 1) {
        paginatedResults.formattedSearchResults!.sort(
          (
            a: PractitionerSearchResultType,
            b: PractitionerSearchResultType,
          ) => {
            const val = compareStrings(
              a['name'].toLowerCase(),
              b['name'].toLowerCase(),
            );
            //secondary sort
            if (val === 0)
              return compareStrings(a['barNumber'], b['barNumber']);
            return val;
          },
        );
      }
    } else {
      paginatedResults.formattedSearchResults = paginatedResults.searchResults;
    }

    const { MAX_SEARCH_RESULTS } = applicationContext.getConstants();

    const showManyResultsMessage = searchResults.length >= MAX_SEARCH_RESULTS;

    Object.assign(result, {
      ...paginatedResults,
      manyResults: MAX_SEARCH_RESULTS,
      showManyResultsMessage,
    });
  }

  return result;
};

export const paginationHelper = (searchResults, currentPage, pageSize) => {
  if (!searchResults) {
    return {};
  }

  return {
    formattedSearchResults: [],
    numberOfResults: searchResults.length,
    searchResults: searchResults.slice(0, currentPage * pageSize),
    searchResultsCount: searchResults.length,
    showLoadMore: searchResults.length > currentPage * pageSize,
    showNoMatches: searchResults.length === 0,
    showSearchResults: searchResults.length > 0,
  };
};
