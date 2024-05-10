import {
  COUNTRY_TYPES,
  PRACTITIONER_SEARCH_PAGE_SIZE,
  US_STATES,
  US_STATES_OTHER,
} from '../../../../../shared/src/business/entities/EntityConstants';
import { ClientApplicationContext } from '../../../applicationContext';
import { Get } from 'cerebral';
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
  sort?: (number | string)[];
  stateFullName?: string;
};

export const formatPractitionerSearchResultRecord = (
  result,
  { applicationContext }: { applicationContext: ClientApplicationContext },
): PractitionerSearchResultType => {
  if (result.petitioners) {
    result.petitionerFullStateNames = result.petitioners.map(petitioner => {
      return {
        contactId: petitioner.contactId,
        state: US_STATES[petitioner.state] || petitioner.state,
      };
    });
  }

  if (result.contact?.state) {
    result.contact.stateFullName =
      US_STATES[result.contact.state] ||
      US_STATES_OTHER[result.contact.state] ||
      result.contact.state;
  }

  result.formattedAdmissionsDate = applicationContext
    .getUtilities()
    .formatDateString(result.admissionsDate, 'MMDDYYYY');

  return result;
};

export const practitionerSearchHelper = (
  get: Get,
  applicationContext: ClientApplicationContext,
):
  | { showNoMatches: boolean; showSearchResults: boolean }
  | {
      activePage: number;
      showPractitionerSearch: boolean;
      showStateSelect: boolean;
    } => {
  const permissions = get(state.permissions);
  const countryType = get(
    state.advancedSearchForm.caseSearchByName.countryType,
  );
  const searchResults = get(state.searchResults['practitioner']);
  const activePage = get(
    state.advancedSearchForm.practitionerSearchByName.pageNum,
  );

  const result = {
    activePage,
    showPractitionerSearch: permissions?.MANAGE_PRACTITIONER_USERS,
    showStateSelect: countryType === COUNTRY_TYPES.DOMESTIC,
  };

  if (searchResults && searchResults.total) {
    let paginatedResults = searchResults.practitioners;

    paginatedResults = paginatedResults.map(searchResult =>
      formatPractitionerSearchResultRecord(searchResult, {
        applicationContext,
      }),
    );

    const pageCount = Math.ceil(
      searchResults.total / PRACTITIONER_SEARCH_PAGE_SIZE,
    );

    Object.assign(result, {
      formattedSearchResults: paginatedResults,
      numberOfResults: searchResults.total,
      pageCount,
      pageSize: PRACTITIONER_SEARCH_PAGE_SIZE,
      showNoMatches: false,
      showPractitionerSearch: result.showPractitionerSearch,
      showSearchResults: true,
    });
  } else if (searchResults && !searchResults.total) {
    // search has been run but hasn't returned any results
    return {
      showNoMatches: true,
      showSearchResults: false,
    };
  }
  return result;
};
