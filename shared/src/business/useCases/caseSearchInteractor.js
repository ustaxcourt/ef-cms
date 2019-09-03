const { Case } = require('../entities/cases/Case');

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

  const caseRecordCatalog = [];
  for (let caseRecord of caseCatalog) {
    const { caseId } = caseRecord;
    const caseDetail = await applicationContext
      .getPersistenceGateway()
      .getCaseByCaseId({
        applicationContext,
        caseId,
      });
    caseRecordCatalog.push(caseDetail);
  }

  let filteredCases = caseRecordCatalog;

  if (countryType) {
    filteredCases = filteredCases.filter(
      myCase =>
        myCase.contactPrimary &&
        myCase.contactPrimary.countryType === countryType,
    );
  }
  if (state) {
    filteredCases = filteredCases.filter(
      myCase => myCase.contactPrimary && myCase.contactPrimary.state === state,
    );
  }
  if (petitionerName) {
    filteredCases = filteredCases.filter(
      myCase =>
        (myCase.contactPrimary &&
          myCase.contactPrimary.name &&
          myCase.contactPrimary.name.includes(petitionerName)) ||
        (myCase.contactSecondary &&
          myCase.contactSecondary.name &&
          myCase.contactSecondary.name.includes(petitionerName)),
    );
  }
  if (yearFiledMin) {
    filteredCases = filteredCases.filter(myCase => {
      const docketNumberYear = myCase.docketNumber.split('-')[1];
      return +docketNumberYear >= +yearFiledMin;
    });
  }
  if (yearFiledMax) {
    filteredCases = filteredCases.filter(myCase => {
      const docketNumberYear = myCase.docketNumber.split('-')[1];
      return +docketNumberYear <= +yearFiledMax;
    });
  }

  return Case.validateRawCollection(filteredCases, { applicationContext });
};
