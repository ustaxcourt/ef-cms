import { MAX_SEARCH_RESULTS } from '../../entities/EntityConstants';
import { PublicCase } from '../../entities/cases/PublicCase';
import {
  createEndOfDayISO,
  createStartOfDayISO,
} from '../../utilities/DateHandler';
import { filterForPublic } from './publicHelpers';

/**
 * casePublicSearchInteractor
 *
 * @param {object} applicationContext the application context
 * @param {object} providers the providers object containing countryType, petitionerName, petitionerState, endDate, startDate
 * @returns {object} the case data
 */

export const casePublicSearchInteractor = async (
  applicationContext: IApplicationContext,
  {
    countryType,
    endDate,
    petitionerName,
    petitionerState,
    startDate,
  }: {
    countryType: string;
    petitionerName: string;
    petitionerState: string;
    startDate: string;
    endDate: string;
  },
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

  const foundCases = await applicationContext
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

  const unsealedFoundCases = (
    await filterForPublic({
      applicationContext,
      unfiltered: foundCases,
    })
  ).slice(0, MAX_SEARCH_RESULTS);

  return PublicCase.validateRawCollection(unsealedFoundCases, {
    applicationContext,
  });
};
