import {
  CaseAdvancedSearchResultItem,
  CaseAdvancedSearchTerms,
  caseAdvancedSearch,
} from '@web-api/persistence/postgres/cases/reports/caseAdvancedSearch';
import {
  MAX_SEARCH_RESULTS,
  US_STATES,
} from '@shared/business/entities/EntityConstants';
import {
  ROLE_PERMISSIONS,
  isAuthorized,
} from '@shared/authorization/authorizationClientService';
import { UnauthorizedError } from '@web-api/errors/errors';
import { UnknownAuthUser } from '@shared/business/entities/authUser/AuthUser';
import {
  createEndOfDayISO,
  createStartOfDayISO,
} from '@shared/business/utilities/DateHandler';
import { filterCaseSearchResultsNotAccessibleToUser } from '@shared/business/utilities/caseFilter';

export type CaseSearchResult = {
  petitionerNames: string[];
  docketNumberWithSuffix: string;
  docketNumber: string;
  receivedAt: string;
  caseCaption: string;
  petitionerStateNames?: string[];
};

export const caseAdvancedSearchInteractor = async (
  {
    countryType,
    endDate,
    petitionerName,
    petitionerState,
    startDate,
  }: CaseAdvancedSearchTerms,
  authorizedUser: UnknownAuthUser,
): Promise<CaseSearchResult[]> => {
  let searchStartDate;
  let searchEndDate;

  if (startDate) {
    const [startMonth, startDay, startYear] = startDate.split('/');

    searchStartDate = createStartOfDayISO({
      day: startDay,
      month: startMonth,
      year: startYear,
    });
  }

  if (endDate) {
    const [endMonth, endDay, endYear] = endDate.split('/');

    searchEndDate = createEndOfDayISO({
      day: endDay,
      month: endMonth,
      year: endYear,
    });
  }

  if (!isAuthorized(authorizedUser, ROLE_PERMISSIONS.ADVANCED_SEARCH)) {
    throw new UnauthorizedError('Unauthorized');
  }

  let foundCases = await caseAdvancedSearch({
    searchTerms: {
      countryType,
      endDate: searchEndDate,
      petitionerName,
      petitionerState,
      startDate: searchStartDate,
    },
  });

  const filteredCases =
    filterCaseSearchResultsNotAccessibleToUser<CaseAdvancedSearchResultItem>(
      foundCases,
      authorizedUser,
    ).slice(0, MAX_SEARCH_RESULTS);

  return filteredCases.map(filteredCase => {
    return {
      caseCaption: filteredCase.caseCaption,
      docketNumber: filteredCase.docketNumber,
      docketNumberWithSuffix: filteredCase.docketNumberWithSuffix,
      petitionerNames: filteredCase.petitioners?.map(p => p.name),
      petitionerStateNames: filteredCase.petitioners?.map(
        p => US_STATES[p.state || ''] || p.state,
      ),
      receivedAt: filteredCase.receivedAt?.toISOString() || '',
    };
  });
};
