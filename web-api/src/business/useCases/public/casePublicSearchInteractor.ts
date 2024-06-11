import { CaseAdvancedSearchParamsRequestType } from '@web-api/business/useCases/caseAdvancedSearchInteractor';
import { CasePublicSearchResultsType } from '@web-api/persistence/elasticsearch/casePublicSearch';
import { ServerApplicationContext } from '@web-api/applicationContext';
import {
  createEndOfDayISO,
  createStartOfDayISO,
} from '../../../../../shared/src/business/utilities/DateHandler';

export const casePublicSearchInteractor = async (
  applicationContext: ServerApplicationContext,
  {
    countryType,
    endDate,
    petitionerName,
    petitionerState,
    startDate,
  }: CaseAdvancedSearchParamsRequestType,
): Promise<{ results: CasePublicSearchResultsType }> => {
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

  return await applicationContext.getPersistenceGateway().casePublicSearch({
    applicationContext,
    searchTerms: {
      countryType,
      endDate: searchEndDate,
      petitionerName,
      petitionerState,
      startDate: searchStartDate,
    },
  });
};
