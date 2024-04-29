import {
  COUNTRY_TYPES,
  PRACTITIONER_SEARCH_PAGE_SIZE,
  US_STATES,
} from '../../../../../shared/src/business/entities/EntityConstants';
import { ClientApplicationContext } from '../../../applicationContext';
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
      US_STATES[result.contact.state] || result.contact.state;
  }

  result.formattedAdmissionsDate = applicationContext
    .getUtilities()
    .formatDateString(result.admissionsDate, 'MMDDYYYY');

  return result;
};

export const practitionerSearchHelper = (
  get: Get,
  applicationContext: ClientApplicationContext,
): any => {
  const permissions = get(state.permissions);
  const countryType = get(
    state.advancedSearchForm.caseSearchByName.countryType,
  );
  const searchResults = get(state.searchResults['practitioner']);

  const result = {
    showPractitionerSearch: permissions?.MANAGE_PRACTITIONER_USERS,
    showStateSelect: countryType === COUNTRY_TYPES.DOMESTIC,
  };

  if (searchResults && searchResults.total) {
    const paginatedResults = searchResults.practitioners;

    paginatedResults.formattedSearchResults = paginatedResults.map(
      searchResult =>
        formatPractitionerSearchResultRecord(searchResult, {
          applicationContext,
        }),
    );

    if (paginatedResults.length > 1) {
      paginatedResults.sort(
        (a: PractitionerSearchResultType, b: PractitionerSearchResultType) => {
          const val = compareStrings(
            a['name'].toLowerCase(),
            b['name'].toLowerCase(),
          );
          //secondary sort
          if (val === 0) return compareStrings(a['barNumber'], b['barNumber']);
          return val;
        },
      );
    }

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
