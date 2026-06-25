import { ServerApplicationContext } from '@web-api/applicationContext';
import { UnauthorizedError } from '@web-api/errors/errors';
import { UnknownAuthUser } from '@shared/business/entities/authUser/AuthUser';
import { filterCaseSearchResultsNotAccessibleToUser } from '@web-api/business/utilities/caseFilter';
import {
  createEndOfDayISO,
  createStartOfDayISO,
} from '@shared/business/utilities/DateHandler';
import { caseAdvancedSearch } from '@web-api/persistence/elasticsearch/caseAdvancedSearch';
import {
  CountryTypes,
  AbbreviatedStates,
  CaseType,
  ProcedureType,
  MAX_CASE_SEARCH_RESULTS,
  US_STATES,
  US_STATES_OTHER,
} from '@shared/business/entities/EntityConstants';
import {
  isAuthorized,
  ROLE_PERMISSIONS,
} from '@shared/authorization/authorizationClientService';
import type { Common } from 'node_modules/@opensearch-project/opensearch/api/_types';

type CaseAdvancedSearchResult = Awaited<
  ReturnType<typeof caseAdvancedSearch>
>[number];

export type CaseAdvancedSearchParamsRequestType = {
  petitionerName: string;
  countryType?: CountryTypes;
  petitionerState?: AbbreviatedStates;
  endDate?: string;
  startDate?: string;
  caseTypes?: CaseType[];
  procedureType?: ProcedureType;
};

export type CaseSearchResult = {
  petitionerNames: string[];
  docketNumberWithSuffix: string;
  docketNumber: string;
  receivedAt: string;
  caseCaption: string;
  petitionerStateNames?: (string | undefined)[];
};

export const caseAdvancedSearchInteractor = async (
  applicationContext: ServerApplicationContext,
  {
    countryType,
    endDate,
    petitionerName,
    petitionerState,
    startDate,
    caseTypes: caseType,
    procedureType,
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

  const searchTerms = {
    countryType,
    endDate: searchEndDate,
    petitionerName,
    petitionerState,
    startDate: searchStartDate,
    caseTypes: caseType,
    procedureType,
  };
  const accessibleCases: CaseAdvancedSearchResult[] = [];
  let searchAfter: Common.SortResults | undefined;
  let useNonExactQuery = false;

  while (accessibleCases.length < MAX_CASE_SEARCH_RESULTS) {
    const foundCases = await caseAdvancedSearch({
      applicationContext,
      resultSize: MAX_CASE_SEARCH_RESULTS - accessibleCases.length,
      searchAfter,
      searchTerms,
      useNonExactQuery,
    });

    if (foundCases.length === 0) {
      if (!searchAfter && !useNonExactQuery) {
        useNonExactQuery = true;
        continue;
      }
      break;
    }

    const filteredCases: CaseAdvancedSearchResult[] =
      filterCaseSearchResultsNotAccessibleToUser(foundCases, authorizedUser);
    accessibleCases.push(
      ...filteredCases.slice(
        0,
        MAX_CASE_SEARCH_RESULTS - accessibleCases.length,
      ),
    );

    if (accessibleCases.length >= MAX_CASE_SEARCH_RESULTS) break;

    const lastFoundCase = foundCases[foundCases.length - 1];
    if (!lastFoundCase.sort) break;

    searchAfter = lastFoundCase.sort;
  }

  return accessibleCases.map(filteredCase => {
    return {
      caseCaption: filteredCase.caseCaption,
      docketNumber: filteredCase.docketNumber,
      docketNumberWithSuffix: filteredCase.docketNumberWithSuffix,
      petitionerNames: filteredCase.petitioners?.map(p => p.name),
      petitionerStateNames: filteredCase.petitioners?.map(p =>
        p.state
          ? US_STATES[p.state] || US_STATES_OTHER[p.state] || p.state
          : undefined,
      ),
      receivedAt: filteredCase.receivedAt,
    };
  });
};
