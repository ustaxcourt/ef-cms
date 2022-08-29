const { Statistic } = require('../entities/Statistic');

/**
 * validateAddDeficiencyStatisticsInteractor
 *
 * @param {object} applicationContext the application context
 * @param {object} providers the providers object
 * @param {object} providers.statistic the statistic data to validate
 * @returns {object} errors (null if no errors)
 */
exports.validateAddDeficiencyStatisticsInteractor = (
  applicationContext,
  { statistic },
) => {
  const errors = new Statistic(statistic, {
    applicationContext,
  }).getFormattedValidationErrors();
  return errors || null;
};
