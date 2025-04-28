import { Case } from '@shared/business/entities/cases/Case';
import {
  ROLE_PERMISSIONS,
  isAuthorized,
} from '@shared/authorization/authorizationClientService';
import { ServerApplicationContext } from '@web-api/applicationContext';
import { Statistic } from '@shared/business/entities/Statistic';
import { UnauthorizedError } from '@web-api/errors/errors';
import { UnknownAuthUser } from '@shared/business/entities/authUser/AuthUser';
import { createCaseStatistic } from '@web-api/persistence/postgres/cases/statistics/createCaseStatistic';
import { getCaseByDocketNumber } from '@web-api/persistence/postgres/cases/getCaseByDocketNumber';
import {
  hashLockId,
  mutexLockWrapper,
} from '@web-api/persistence/postgres/utils/mutex';

export const addDeficiencyStatistic = async (
  applicationContext: ServerApplicationContext,
  {
    determinationDeficiencyAmount,
    determinationTotalPenalties,
    docketNumber,
    irsDeficiencyAmount,
    irsTotalPenalties,
    lastDateOfPeriod,
    penalties,
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
    year: string;
    yearOrPeriod: string;
  },
  authorizedUser: UnknownAuthUser,
) => {
  if (!isAuthorized(authorizedUser, ROLE_PERMISSIONS.ADD_EDIT_STATISTICS)) {
    throw new UnauthorizedError('Unauthorized for editing statistics');
  }

  const oldCase = await getCaseByDocketNumber({
    applicationContext,
    docketNumber,
  });

  const statisticEntity = new Statistic({
    determinationDeficiencyAmount,
    determinationTotalPenalties,
    irsDeficiencyAmount,
    irsTotalPenalties,
    lastDateOfPeriod,
    penalties,
    year,
    yearOrPeriod,
  }).validate();

  const newCase = new Case(oldCase, { authorizedUser });
  newCase.addStatistic(statisticEntity);

  const validRawCase = newCase.validate().toRawObject();

  await createCaseStatistic({
    docketNumber: newCase.docketNumber,
    statistic: statisticEntity,
  });

  return validRawCase;
};

export const addDeficiencyStatisticInteractor = async (
  applicationContext: ServerApplicationContext,
  {
    determinationDeficiencyAmount,
    determinationTotalPenalties,
    docketNumber,
    irsDeficiencyAmount,
    irsTotalPenalties,
    lastDateOfPeriod,
    penalties,
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
    year: string;
    yearOrPeriod: string;
  },
  authorizedUser: UnknownAuthUser,
) => {
  const lockId = hashLockId(`case|${docketNumber}`);

  return mutexLockWrapper({
    lockId,
    callback: () =>
      addDeficiencyStatistic(
        applicationContext,
        {
          determinationDeficiencyAmount,
          determinationTotalPenalties,
          docketNumber,
          irsDeficiencyAmount,
          irsTotalPenalties,
          lastDateOfPeriod,
          penalties,
          year,
          yearOrPeriod,
        },
        authorizedUser,
      ),
  });
};

// export const addDeficiencyStatisticInteractor = withLocking(
//   addDeficiencyStatistic,
//   (_applicationContext, { docketNumber }) => ({
//     identifiers: [`case|${docketNumber}`],
//   }),
// );
