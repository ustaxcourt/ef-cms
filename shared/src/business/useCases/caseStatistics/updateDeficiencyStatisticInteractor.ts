import { Case } from '../../entities/cases/Case';
import {
  ROLE_PERMISSIONS,
  isAuthorized,
} from '../../../authorization/authorizationClientService';
import { Statistic } from '../../entities/Statistic';
import { UnauthorizedError } from '@web-api/errors/errors';
import { withLocking } from '@shared/business/useCaseHelper/acquireLock';

/**
 * updateDeficiencyStatistic
 *
 * @param {object} applicationContext the application context
 * @param {object} providers the providers object
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
export const updateDeficiencyStatistic = async (
  applicationContext: IApplicationContext,
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
  }: {
    determinationDeficiencyAmount: number;
    determinationTotalPenalties: number;
    docketNumber: string;
    irsDeficiencyAmount: number;
    irsTotalPenalties: number;
    lastDateOfPeriod: string;
    penalties: {
      penaltyId?: string;
      name: string;
      penaltyAmount: number;
      statisticId?: string;
    }[];
    statisticId: string;
    year: string;
    yearOrPeriod: string;
  },
) => {
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
      penalties,
      statisticId,
      year,
      yearOrPeriod,
    },
    { applicationContext },
  ).validate();

  const newCase = new Case(oldCase, { applicationContext });
  newCase.updateStatistic(statisticEntity, statisticId);

  const updatedCase = await applicationContext
    .getUseCaseHelpers()
    .updateCaseAndAssociations({
      applicationContext,
      caseToUpdate: newCase,
    });

  return new Case(updatedCase, { applicationContext }).validate().toRawObject();
};

export const updateDeficiencyStatisticInteractor = withLocking(
  updateDeficiencyStatistic,
  (_applicationContext, { docketNumber }) => ({
    identifiers: [`case|${docketNumber}`],
  }),
);
