const { PublicCase } = require('../../entities/cases/PublicCase');

/**
 * casePublicSearchInteractor
 *
 * @param {object} providers the providers object containing applicationContext, countryType, petitionerName, petitionerState, yearFiledMax, yearFiledMin
 * @returns {object} the case data
 */
exports.casePublicSearchInteractor = async ({
  applicationContext,
  countryType,
  petitionerName,
  petitionerState,
  yearFiledMax,
  yearFiledMin,
}) => {
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

  return PublicCase.validateRawCollection(foundCases, { applicationContext });
};
