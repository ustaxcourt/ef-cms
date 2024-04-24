import { ClientApplicationContext } from '../../../applicationContext';
import { Get } from 'cerebral';
import { US_STATES } from '../../../../../shared/src/business/entities/EntityConstants';
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

export const practitionerSearchResultHelper = (
  get: Get,
  applicationContext: ClientApplicationContext,
): any => {
  const permissions = get(state.permissions);
  const countryType = get(
    state.advancedSearchForm.caseSearchByName.countryType,
  );
  const searchResults = get(state.searchResults['practitioner']);
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

    paginatedResults.formattedSearchResults =
      paginatedResults.searchResults.map(searchResult =>
        formatPractitionerSearchResultRecord(searchResult, {
          applicationContext,
        }),
      );

    if (paginatedResults.formattedSearchResults!.length > 1) {
      paginatedResults.formattedSearchResults!.sort(
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

    Object.assign(result, { ...paginatedResults });
    return result;
  }
};
