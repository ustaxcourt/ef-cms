import { put } from '../requests';

/**
 * updateDeficiencyStatisticInteractor
 *
 * @param {object} applicationContext the application context
 * @param {object} providers the providers object
 * @param {string} providers.docketNumber the docket number of the case to update statistics
 * @param {number} providers.determinationDeficiencyAmount deficiency amount determined by the court
 * @param {number} providers.determinationTotalPenalties total penalties amount determined by the court
 * @param {number} providers.irsDeficiencyAmount deficiency amount from the IRS
 * @param {number} providers.irsTotalPenalties total penalties amount from the IRS
 * @param {string} providers.lastDateOfPeriod last date of the period for the statistic
 * @param {Array} providers.penalties an array of the penalty objects for the statistic
 * @param {string} providers.statisticId the id of the statistic to update
 * @param {number} providers.year year for the statistic
 * @param {string} providers.yearOrPeriod whether the statistic is for a year or period
 * @returns {Promise<*>} the promise of the api call
 */
export const updateDeficiencyStatisticInteractor = (
  applicationContext,
  {
    determinationDeficiencyAmount,
    determinationTotalPenalties,
    docketNumber,
    irsDeficiencyAmount,
    irsTotalPenalties,
    lastDateOfPeriod,
    penalties,
    statisticId,
    year,
    yearOrPeriod,
  },
) => {
  return put({
    applicationContext,
    body: {
      determinationDeficiencyAmount,
      determinationTotalPenalties,
      irsDeficiencyAmount,
      irsTotalPenalties,
      lastDateOfPeriod,
      penalties,
      year,
      yearOrPeriod,
    },
    endpoint: `/case-meta/${docketNumber}/statistics/${statisticId}`,
  });
};
