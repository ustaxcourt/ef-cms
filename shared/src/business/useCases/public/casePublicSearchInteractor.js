const { PublicCase } = require('../../entities/cases/PublicCase');

/**
 * casePublicSearchInteractor
 *
 * @param {object} providers the providers object containing applicationContext, countryType, petitionerName, petitionerState, yearFiledMax, yearFiledMin
 * @returns {object} the case data
 */
exports.casePublicSearchInteractor = async providers => {
  const { applicationContext } = providers;

  const foundCases = await applicationContext
    .getPersistenceGateway()
    .casePublicSearch(providers);

  const filteredCases = foundCases.filter(item => {
    return !item.sealedDate && item.docketNumber && item.caseCaption;
  });

  const makeSafe = item =>
    new PublicCase(item, { applicationContext }).validate().toRawObject();

  return filteredCases.map(makeSafe);
};
