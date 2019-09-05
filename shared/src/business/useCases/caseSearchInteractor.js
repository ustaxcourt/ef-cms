/**
 * caseSearchInteractor
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {string} providers.countryType the country type to search cases by (domestic/international)
 * @param {string} providers.petitionerName the name of the petitioner to search cases by
 * @param {string} providers.state the state of the petitioner to search cases by
 * @param {string} providers.yearFiledMax the max year filed to search cases by
 * @param {string} providers.yearFiledMin the min year filed to search cases by
 * @returns {object} the case data
 */
exports.caseSearchInteractor = async ({
  applicationContext,
  countryType,
  petitionerName,
  state,
  yearFiledMax,
  yearFiledMin,
}) => {
  const caseCatalog = await applicationContext
    .getPersistenceGateway()
    .getAllCatalogCases({
      applicationContext,
    });

  let filteredCases = caseCatalog;

  if (petitionerName) {
    petitionerName = petitionerName.toLowerCase();
    filteredCases = filteredCases.filter(
      myCase =>
        (myCase.contactPrimary &&
          myCase.contactPrimary.name &&
          myCase.contactPrimary.name.toLowerCase().includes(petitionerName)) ||
        (myCase.contactSecondary &&
          myCase.contactSecondary.name &&
          myCase.contactSecondary.name.toLowerCase().includes(petitionerName)),
    );
  }
  if (countryType) {
    filteredCases = filteredCases.filter(
      myCase =>
        (myCase.contactPrimary &&
          myCase.contactPrimary.countryType === countryType) ||
        (myCase.contactSecondary &&
          myCase.contactSecondary.countryType === countryType),
    );
  }
  if (state) {
    filteredCases = filteredCases.filter(
      myCase =>
        (myCase.contactPrimary && myCase.contactPrimary.state === state) ||
        (myCase.contactSecondary && myCase.contactSecondary.state === state),
    );
  }
  if (yearFiledMin) {
    filteredCases = filteredCases.filter(
      myCase => +myCase.yearFiled >= +yearFiledMin,
    );
  }
  if (yearFiledMax) {
    filteredCases = filteredCases.filter(
      myCase => +myCase.yearFiled <= +yearFiledMax,
    );
  }

  return filteredCases;
};
