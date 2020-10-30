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
      omitSealed: true,
      petitionerName,
      petitionerState,
      yearFiledMax,
      yearFiledMin,
    });

  const makeSafe = item =>
    new PublicCase(item, { applicationContext }).validate().toRawObject();

  return foundCases.map(makeSafe);
};
