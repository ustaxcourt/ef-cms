import {
  AbbreviatedStates,
  CountryTypes,
  MAX_SEARCH_RESULTS,
  US_STATES,
} from '@shared/business/entities/EntityConstants';
import {
  ROLE_PERMISSIONS,
  isAuthorized,
} from '@shared/authorization/authorizationClientService';
import { ServerApplicationContext } from '@web-api/applicationContext';
import { UnauthorizedError } from '@web-api/errors/errors';
import { UnknownAuthUser } from '@shared/business/entities/authUser/AuthUser';
import { filterCaseSearchResultsNotAccessibleToUser } from '@shared/business/utilities/caseFilter';
import {
  createEndOfDayISO,
  createStartOfDayISO,
} from '@shared/business/utilities/DateHandler';
import { caseAdvancedSearch } from '@web-api/persistence/elasticsearch/caseAdvancedSearch';

export type CaseAdvancedSearchParamsRequestType = {
  petitionerName: string;
  countryType?: CountryTypes;
  petitionerState?: AbbreviatedStates;
  endDate?: string;
  startDate?: string;
};

export type CaseSearchResult = {
  petitionerNames: string[];
  docketNumberWithSuffix: string;
  docketNumber: string;
  receivedAt: string;
  caseCaption: string;
  petitionerStateNames?: string[];
};

export const caseAdvancedSearchInteractor = async (
  applicationContext: ServerApplicationContext,
  {
    countryType,
    endDate,
    petitionerName,
    petitionerState,
    startDate,
  }: CaseAdvancedSearchParamsRequestType,
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

  const foundCases = await caseAdvancedSearch({
    applicationContext,
    searchTerms: {
      countryType,
      endDate: searchEndDate,
      petitionerName,
      petitionerState,
      startDate: searchStartDate,
    },
  });

  const filteredCases = filterCaseSearchResultsNotAccessibleToUser(
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
        p => US_STATES[p.state] || p.state,
      ),
      receivedAt: filteredCase.receivedAt,
    };
  });
};
