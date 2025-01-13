import {
  CaseAdvancedSearchResultItem,
  CaseAdvancedSearchTerms,
} from '@web-api/persistence/postgres/cases/reports/caseAdvancedSearch';
import { CaseSearchResult } from '@web-api/business/useCases/caseAdvancedSearchInteractor';
import { US_STATES } from '@shared/business/entities/EntityConstants';
import { casePublicSearch } from '@web-api/persistence/postgres/cases/reports/casePublicSearch';
import {
  createEndOfDayISO,
  createStartOfDayISO,
} from '@shared/business/utilities/DateHandler';
import { filterCaseSearchResultsNotAccessibleToUser } from '@shared/business/utilities/caseFilter';

export const casePublicSearchInteractor = async ({
  countryType,
  endDate,
  petitionerName,
  petitionerState,
  startDate,
}: CaseAdvancedSearchTerms): Promise<CaseSearchResult[]> => {
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

  const foundCases = await casePublicSearch({
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
      undefined,
    );

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
