import { PublicCase } from '../../entities/cases/PublicCase';
import {
  createEndOfDayISO,
  createStartOfDayISO,
} from '../../utilities/DateHandler';

export type CasePublicSearchRequestType = {
  countryType?: string;
  petitionerName: string;
  petitionerState?: string;
  startDate?: string;
  endDate?: string;
};

export const casePublicSearchInteractor = async (
  applicationContext: IApplicationContext,
  {
    countryType,
    endDate,
    petitionerName,
    petitionerState,
    startDate,
  }: CasePublicSearchRequestType,
) => {
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

  const { results: foundCases } = await applicationContext
    .getPersistenceGateway()
    .casePublicSearch({
      applicationContext,
      searchTerms: {
        countryType,
        endDate: searchEndDate,
        petitionerName,
        petitionerState,
        startDate: searchStartDate,
      },
    });

  return PublicCase.validateRawCollection(foundCases, {
    applicationContext,
  });
};
