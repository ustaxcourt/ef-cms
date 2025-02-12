import { Case } from '@shared/business/entities/cases/Case';
import {
  ROLE_PERMISSIONS,
  isAuthorized,
} from '@shared/authorization/authorizationClientService';
import { ServerApplicationContext } from '@web-api/applicationContext';
import { UnauthorizedError } from '@web-api/errors/errors';
import { UnknownAuthUser } from '@shared/business/entities/authUser/AuthUser';
import { deleteCaseStatistic } from '@web-api/persistence/postgres/cases/statistics/deleteCaseStatistic';
import { getCaseByDocketNumber } from '@web-api/persistence/postgres/cases/getCaseByDocketNumber';
import { withLocking } from '@web-api/business/useCaseHelper/acquireLock';

export const deleteDeficiencyStatistic = async (
  applicationContext: ServerApplicationContext,
  { docketNumber, statisticId }: { docketNumber: string; statisticId: string },
  authorizedUser: UnknownAuthUser,
) => {
  if (!isAuthorized(authorizedUser, ROLE_PERMISSIONS.ADD_EDIT_STATISTICS)) {
    throw new UnauthorizedError('Unauthorized for editing statistics');
  }

  const oldCase = await getCaseByDocketNumber({
    applicationContext,
    docketNumber,
  });

  const newCase = new Case(oldCase, { authorizedUser });
  newCase.deleteStatistic(statisticId);
  const validRawCase = newCase.validate().toRawObject();

  await deleteCaseStatistic({ statisticId });

  return validRawCase;
};

export const deleteDeficiencyStatisticInteractor = withLocking(
  deleteDeficiencyStatistic,
  (_applicationContext, { docketNumber }) => ({
    identifiers: [`case|${docketNumber}`],
  }),
);
