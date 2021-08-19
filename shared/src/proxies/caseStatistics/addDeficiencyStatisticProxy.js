const { post } = require('../requests');

/**
 * addDeficiencyStatisticInteractor
 *
 * @param {object} applicationContext the application context
 * @param {object} providers the providers object
 * @param {string} providers.docketNumber the docket number of the case to update statistics
 * @param {number} providers.determinationDeficiencyAmount deficiency amount determined by the court
 * @param {number} providers.determinationTotalPenalties total penalties amount determined by the court
 * @param {number} providers.irsDeficiencyAmount deficiency amount from the IRS
 * @param {number} providers.irsTotalPenalties total penalties amount from the IRS
 * @param {string} providers.lastDateOfPeriod last date of the period for the statistic
 * @param {number} providers.year year for the statistic
 * @param {string} providers.yearOrPeriod whether the statistic is for a year or period
 * @returns {Promise<*>} the promise of the api call
 */
exports.addDeficiencyStatisticInteractor = (
  applicationContext,
  {
    determinationDeficiencyAmount,
    determinationTotalPenalties,
    docketNumber,
    irsDeficiencyAmount,
    irsTotalPenalties,
    lastDateOfPeriod,
    year,
    yearOrPeriod,
  },
) => {
  return post({
    applicationContext,
    body: {
      determinationDeficiencyAmount,
      determinationTotalPenalties,
      irsDeficiencyAmount,
      irsTotalPenalties,
      lastDateOfPeriod,
      year,
      yearOrPeriod,
    },
    endpoint: `/case-meta/${docketNumber}/statistics`,
  });
};
