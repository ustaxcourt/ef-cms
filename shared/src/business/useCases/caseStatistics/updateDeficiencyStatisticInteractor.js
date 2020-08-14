const {
  isAuthorized,
  ROLE_PERMISSIONS,
} = require('../../../authorization/authorizationClientService');
const { Case } = require('../../entities/cases/Case');
const { Statistic } = require('../../entities/Statistic');
const { UnauthorizedError } = require('../../../errors/errors');

/**
 * updateDeficiencyStatisticInteractor
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {string} providers.docketNumber the docket number of the case to update statistics
 * @param {number} providers.determinationDeficiencyAmount deficiency amount determined by the court
 * @param {number} providers.determinationTotalPenalties total penalties amount determined by the court
 * @param {number} providers.irsDeficiencyAmount deficiency amount from the IRS
 * @param {number} providers.irsTotalPenalties total penalties amount from the IRS
 * @param {string} providers.lastDateOfPeriod last date of the period for the statistic
 * @param {string} providers.statisticId id of the statistic on the case to update
 * @param {number} providers.year year for the statistic
 * @param {string} providers.yearOrPeriod whether the statistic is for a year or period
 * @returns {object} the updated case
 */
exports.updateDeficiencyStatisticInteractor = async ({
  applicationContext,
  determinationDeficiencyAmount,
  determinationTotalPenalties,
  docketNumber,
  irsDeficiencyAmount,
  irsTotalPenalties,
  lastDateOfPeriod,
  statisticId,
  year,
  yearOrPeriod,
}) => {
  const user = applicationContext.getCurrentUser();

  if (!isAuthorized(user, ROLE_PERMISSIONS.ADD_EDIT_STATISTICS)) {
    throw new UnauthorizedError('Unauthorized for editing statistics');
  }

  const oldCase = await applicationContext
    .getPersistenceGateway()
    .getCaseByDocketNumber({ applicationContext, docketNumber });

  const statisticEntity = new Statistic(
    {
      determinationDeficiencyAmount,
      determinationTotalPenalties,
      irsDeficiencyAmount,
      irsTotalPenalties,
      lastDateOfPeriod,
      statisticId,
      year,
      yearOrPeriod,
    },
    { applicationContext },
  ).validate();

  const newCase = new Case(oldCase, { applicationContext });
  newCase.updateStatistic(statisticEntity, statisticId);

  const updatedCase = await applicationContext
    .getPersistenceGateway()
    .updateCase({
      applicationContext,
      caseToUpdate: newCase.validate().toRawObject(),
    });

  return new Case(updatedCase, { applicationContext }).validate().toRawObject();
};
