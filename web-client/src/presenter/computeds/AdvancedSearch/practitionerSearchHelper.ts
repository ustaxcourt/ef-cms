import { ClientApplicationContext } from '../../../applicationContext';
import { Get } from 'cerebral';
import {
  PRACTITIONER_SEARCH_PAGE_SIZE,
  US_STATES,
  US_STATES_OTHER,
} from '../../../../../shared/src/business/entities/EntityConstants';
import { formatPositiveNumber } from '@shared/business/utilities/formatPositiveNumber';
import { state } from '@web-client/presenter/app.cerebral';

export type FormattedPractitionerSearchResultType = {
  admissionsStatus: string;
  admissionsDate: string;
  barNumber: string;
  contact?: { state: string; stateFullName?: string };
  formattedAdmissionsDate: string;
  name: string;
  originalBarState: string;
  practiceType: string;
  practitionerType: string;
  sort?: (number | string)[];
  state?: string;
  stateFullName?: string;
  originalBarStateFullName?: string;
};

type PractitionerSearchHelperResult = {
  showNoMatches: boolean;
  showSearchResults: boolean;
  activePage: number;
  formattedSearchResults: FormattedPractitionerSearchResultType[];
  numberOfResults: string;
  pageCount: number;
  pageSize: number;
  showPaginator: boolean;
  isPublicUser: boolean;
  showStateColumn: boolean;
};

export const practitionerSearchHelper = (
  get: Get,
  applicationContext: ClientApplicationContext,
): PractitionerSearchHelperResult => {
  const searchResults = get(state.searchResults['practitioner']);
  const isPublicUser = applicationContext.isPublicUser();

  let result: PractitionerSearchHelperResult = {
    activePage: 0,
    formattedSearchResults: [],
    isPublicUser,
    numberOfResults: '0',
    pageCount: 0,
    pageSize: 0,
    showNoMatches: false,
    showPaginator: false,
    showSearchResults: false,
    showStateColumn: !isPublicUser,
  };

  if (searchResults && !searchResults.total) {
    // search has been run but hasn't returned any results
    return {
      ...result,
      showNoMatches: true,
      showSearchResults: false,
    };
  }

  if (searchResults && searchResults.total) {
    result.activePage = get(
      state.advancedSearchForm.practitionerSearchByName.pageNum,
    );
    let paginatedResults = searchResults.practitioners;

    paginatedResults = paginatedResults.map(searchResult =>
      formatPractitionerSearchResultRecord(searchResult, {
        applicationContext,
      }),
    );

    const pageCount = Math.ceil(
      searchResults.total / PRACTITIONER_SEARCH_PAGE_SIZE,
    );

    result = {
      ...result,
      formattedSearchResults: paginatedResults,
      numberOfResults: formatPositiveNumber(searchResults.total),
      pageCount,
      pageSize: PRACTITIONER_SEARCH_PAGE_SIZE,
      showNoMatches: false,
      showPaginator: pageCount > 1,
      showSearchResults: true,
    };
  }

  return result;
};

export const formatPractitionerSearchResultRecord = (
  result,
  { applicationContext }: { applicationContext: ClientApplicationContext },
): FormattedPractitionerSearchResultType => {
  if (result.petitioners) {
    result.petitionerFullStateNames = result.petitioners.map(petitioner => {
      return {
        contactId: petitioner.contactId,
        state: US_STATES[petitioner.state] || petitioner.state,
      };
    });
  }

  result.stateFullName = getFullState(result.state);
  result.originalBarStateFullName = getFullState(result.originalBarState);

  result.formattedAdmissionsDate = applicationContext
    .getUtilities()
    .formatDateString(result.admissionsDate, 'MMDDYYYY');

  return result;
};

function getFullState(state: string): string | undefined {
  if (!state) return;
  return US_STATES[state] || US_STATES_OTHER[state] || state;
}
