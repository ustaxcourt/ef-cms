const { Statistic } = require('../entities/Statistic');

/**
 * validatePetitionFromPaper
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {object} providers.petition the petition data to validate
 * @returns {object} errors (null if no errors)
 */
exports.validateAddDeficiencyStatisticsInteractor = ({
  applicationContext,
  statistic,
}) => {
  const errors = new Statistic(statistic, {
    applicationContext,
  }).getFormattedValidationErrors();
  return errors || null;
};
