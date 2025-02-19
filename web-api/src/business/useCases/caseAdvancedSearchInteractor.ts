import {
  AbbrevatedStates,
  CountryTypes,
  MAX_SEARCH_RESULTS,
  US_STATES,
} from '../../../../shared/src/business/entities/EntityConstants';
import {
  ROLE_PERMISSIONS,
  isAuthorized,
} from '../../../../shared/src/authorization/authorizationClientService';
import { ServerApplicationContext } from '@web-api/applicationContext';
import { UnauthorizedError } from '@web-api/errors/errors';
import { UnknownAuthUser } from '@shared/business/entities/authUser/AuthUser';
import { caseSearchFilter } from '../../../../shared/src/business/utilities/caseFilter';
import {
  createEndOfDayISO,
  createStartOfDayISO,
} from '../../../../shared/src/business/utilities/DateHandler';

export type CaseAdvancedSearchParamsRequestType = {
  petitionerName: string;
  countryType?: CountryTypes;
  petitionerState?: AbbrevatedStates;
  endDate?: string;
  startDate?: string;
  caseType?: Record<string, string>;
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
    caseType,
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

  const foundCases = await applicationContext
    .getPersistenceGateway()
    .caseAdvancedSearch({
      applicationContext,
      searchTerms: {
        countryType,
        endDate: searchEndDate,
        petitionerName,
        petitionerState,
        startDate: searchStartDate,
        caseType,
      },
    });

  const filteredCases = caseSearchFilter(foundCases, authorizedUser).slice(
    0,
    MAX_SEARCH_RESULTS,
  );

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
