import {
  AbbrevatedStates,
  CountryTypes,
  MAX_SEARCH_RESULTS,
} from '../../../../shared/src/business/entities/EntityConstants';
import {
  ROLE_PERMISSIONS,
  isAuthorized,
} from '../../../../shared/src/authorization/authorizationClientService';
import { ServerApplicationContext } from '@web-api/applicationContext';
import { UnauthorizedError } from '@web-api/errors/errors';
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
) => {
  const authorizedUser = applicationContext.getCurrentUser();
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

  let foundCases = await applicationContext
    .getPersistenceGateway()
    .caseAdvancedSearch({
      applicationContext,
      searchTerms: {
        countryType,
        endDate: searchEndDate,
        petitionerName,
        petitionerState,
        startDate: searchStartDate,
      },
    });

  const filteredCases = caseSearchFilter(foundCases, authorizedUser).slice(
    0,
    MAX_SEARCH_RESULTS,
  );

  return filteredCases;
};
