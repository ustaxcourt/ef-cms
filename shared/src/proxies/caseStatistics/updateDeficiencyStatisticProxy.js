const { put } = require('../requests');

/**
 * updateDeficiencyStatisticInteractor
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {string} providers.caseId the id of the case to update statistics
 * @param {number} providers.determinationDeficiencyAmount deficiency amount determined by the court
 * @param {number} providers.determinationTotalPenalties total penalties amount determined by the court
 * @param {number} providers.irsDeficiencyAmount deficiency amount from the IRS
 * @param {number} providers.irsTotalPenalties total penalties amount from the IRS
 * @param {string} providers.lastDateOfPeriod last date of the period for the statistic
 * @param {string} providers.statisticId the id of the statistic to update
 * @param {number} providers.year year for the statistic
 * @param {string} providers.yearOrPeriod whether the statistic is for a year or period
 * @returns {Promise<*>} the promise of the api call
 */
exports.updateDeficiencyStatisticInteractor = ({
  applicationContext,
  caseId,
  determinationDeficiencyAmount,
  determinationTotalPenalties,
  irsDeficiencyAmount,
  irsTotalPenalties,
  lastDateOfPeriod,
  statisticId,
  year,
  yearOrPeriod,
}) => {
  return put({
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
    endpoint: `/case-meta/${caseId}/statistics/${statisticId}`,
  });
};
