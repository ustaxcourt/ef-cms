import { MAX_SEARCH_RESULTS } from '../../entities/EntityConstants';
import { PublicCase } from '../../entities/cases/PublicCase';
import { filterForPublic } from './publicHelpers';

/**
 * casePublicSearchInteractor
 *
 * @param {object} applicationContext the application context
 * @param {object} providers the providers object containing countryType, petitionerName, petitionerState, yearFiledMax, yearFiledMin
 * @returns {object} the case data
 */

export const casePublicSearchInteractor = async (
  applicationContext: IApplicationContext,
  {
    countryType,
    petitionerName,
    petitionerState,
    yearFiledMax,
    yearFiledMin,
  }: {
    countryType: string;
    petitionerName: string;
    petitionerState: string;
    yearFiledMax: string;
    yearFiledMin: string;
  },
) => {
  const foundCases = await applicationContext
    .getPersistenceGateway()
    .casePublicSearch({
      applicationContext,
      countryType,
      petitionerName,
      petitionerState,
      yearFiledMax,
      yearFiledMin,
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
