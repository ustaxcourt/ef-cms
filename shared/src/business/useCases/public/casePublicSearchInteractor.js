const { filterForPublic } = require('./publicHelpers');
const { MAX_SEARCH_RESULTS } = require('../../entities/EntityConstants');
const { PublicCase } = require('../../entities/cases/PublicCase');

/**
 * casePublicSearchInteractor
 *
 * @param {object} applicationContext the application context
 * @param {object} providers the providers object containing countryType, petitionerName, petitionerState, yearFiledMax, yearFiledMin
 * @returns {object} the case data
 */

exports.casePublicSearchInteractor = async (
  applicationContext,
  { countryType, petitionerName, petitionerState, yearFiledMax, yearFiledMin },
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
