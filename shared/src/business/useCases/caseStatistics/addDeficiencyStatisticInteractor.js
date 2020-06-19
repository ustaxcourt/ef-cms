const {
  isAuthorized,
  ROLE_PERMISSIONS,
} = require('../../../authorization/authorizationClientService');
const { Case } = require('../../entities/cases/Case');
const { Statistic } = require('../../entities/Statistic');
const { UnauthorizedError } = require('../../../errors/errors');

/**
 * addDeficiencyStatisticInteractor
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {string} providers.caseId the id of the case to update statistics
 * @param {number} providers.determinationDeficiencyAmount deficiency amount determined by the court
 * @param {number} providers.determinationTotalPenalties total penalties amount determined by the court
 * @param {number} providers.irsDeficiencyAmount deficiency amount from the IRS
 * @param {number} providers.irsTotalPenalties total penalties amount from the IRS
 * @param {string} providers.lastDateOfPeriod last date of the period for the statistic
 * @param {number} providers.year year for the statistic
 * @param {string} providers.yearOrPeriod whether the statistic is for a year or period
 * @returns {object} the updated case
 */
exports.addDeficiencyStatisticInteractor = async ({
  applicationContext,
  caseId,
  determinationDeficiencyAmount,
  determinationTotalPenalties,
  irsDeficiencyAmount,
  irsTotalPenalties,
  lastDateOfPeriod,
  year,
  yearOrPeriod,
}) => {
  const user = applicationContext.getCurrentUser();

  if (!isAuthorized(user, ROLE_PERMISSIONS.ADD_EDIT_STATISTICS)) {
    throw new UnauthorizedError('Unauthorized for editing statistics');
  }

  const oldCase = await applicationContext
    .getPersistenceGateway()
    .getCaseByCaseId({ applicationContext, caseId });

  const statisticEntity = new Statistic(
    {
      determinationDeficiencyAmount,
      determinationTotalPenalties,
      irsDeficiencyAmount,
      irsTotalPenalties,
      lastDateOfPeriod,
      year,
      yearOrPeriod,
    },
    { applicationContext },
  ).validate();

  const newCase = new Case(oldCase, { applicationContext });
  newCase.addStatistic(statisticEntity);

  const updatedCase = await applicationContext
    .getPersistenceGateway()
    .updateCase({
      applicationContext,
      caseToUpdate: newCase.validate().toRawObject(),
    });

  return new Case(updatedCase, { applicationContext }).validate().toRawObject();
};
