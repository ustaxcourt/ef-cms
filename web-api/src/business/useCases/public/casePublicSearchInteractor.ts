import {
  CaseAdvancedSearchParamsRequestType,
  CaseSearchResult,
} from '@web-api/business/useCases/caseAdvancedSearchInteractor';
import { ServerApplicationContext } from '@web-api/applicationContext';
import {
  createEndOfDayISO,
  createStartOfDayISO,
} from '@shared/business/utilities/DateHandler';
import { casePublicSearch } from '@web-api/persistence/elasticsearch/casePublicSearch';

export const casePublicSearchInteractor = async (
  applicationContext: ServerApplicationContext,
  {
    countryType,
    endDate,
    petitionerName,
    petitionerState,
    startDate,
    caseTypes,
    procedureType,
  }: CaseAdvancedSearchParamsRequestType,
): Promise<{ results: CaseSearchResult[] }> => {
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

  return await casePublicSearch({
    applicationContext,
    searchTerms: {
      countryType,
      endDate: searchEndDate,
      petitionerName,
      petitionerState,
      startDate: searchStartDate,
      caseTypes,
      procedureType,
    },
  });
};
