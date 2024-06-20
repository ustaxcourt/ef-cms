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
  practiceType: string;
  practitionerType: string;
  state?: string;
  sort?: (number | string)[];
  stateFullName?: string;
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
  stateHeaderText: string;
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
    stateHeaderText: isPublicUser ? 'Original Bar State' : 'State',
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
