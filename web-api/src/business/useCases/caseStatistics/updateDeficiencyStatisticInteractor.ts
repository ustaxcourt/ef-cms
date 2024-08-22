import { Case } from '../../../../../shared/src/business/entities/cases/Case';
import {
  ROLE_PERMISSIONS,
  isAuthorized,
} from '../../../../../shared/src/authorization/authorizationClientService';
import { ServerApplicationContext } from '@web-api/applicationContext';
import { Statistic } from '../../../../../shared/src/business/entities/Statistic';
import { UnauthorizedError } from '@web-api/errors/errors';
import { UnknownAuthUser } from '@shared/business/entities/authUser/AuthUser';
import { withLocking } from '@web-api/business/useCaseHelper/acquireLock';

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
  applicationContext: ServerApplicationContext,
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
  authorizedUser: UnknownAuthUser,
) => {
  if (!isAuthorized(authorizedUser, ROLE_PERMISSIONS.ADD_EDIT_STATISTICS)) {
    throw new UnauthorizedError('Unauthorized for editing statistics');
  }

  const oldCase = await applicationContext
    .getPersistenceGateway()
    .getCaseByDocketNumber({ applicationContext, docketNumber });

  const statisticEntity = new Statistic({
    determinationDeficiencyAmount,
    determinationTotalPenalties,
    irsDeficiencyAmount,
    irsTotalPenalties,
    lastDateOfPeriod,
    penalties,
    statisticId,
    year,
    yearOrPeriod,
  }).validate();

  const newCase = new Case(oldCase, { authorizedUser });
  newCase.updateStatistic(statisticEntity, statisticId);

  const updatedCase = await applicationContext
    .getUseCaseHelpers()
    .updateCaseAndAssociations({
      applicationContext,
      authorizedUser,
      caseToUpdate: newCase,
    });

  return new Case(updatedCase, { authorizedUser }).validate().toRawObject();
};

export const updateDeficiencyStatisticInteractor = withLocking(
  updateDeficiencyStatistic,
  (_applicationContext, { docketNumber }) => ({
    identifiers: [`case|${docketNumber}`],
  }),
);
