import { Case } from '../../../../../shared/src/business/entities/cases/Case';
import {
  ROLE_PERMISSIONS,
  isAuthorized,
} from '../../../../../shared/src/authorization/authorizationClientService';
import { ServerApplicationContext } from '@web-api/applicationContext';
import { UnauthorizedError } from '@web-api/errors/errors';
import { UnknownAuthUser } from '@shared/business/entities/authUser/AuthUser';
import { withLocking } from '@web-api/business/useCaseHelper/acquireLock';

/**
 * deleteDeficiencyStatistic
 *
 * @param {object} applicationContext the application context
 * @param {object} providers the providers object
 * @param {string} providers.docketNumber the docket number of the case to delete statistics
 * @param {string} providers.statisticId id of the statistic on the case to delete
 * @returns {object} the updated case
 */
export const deleteDeficiencyStatistic = async (
  applicationContext: ServerApplicationContext,
  { docketNumber, statisticId }: { docketNumber: string; statisticId: string },
  authorizedUser: UnknownAuthUser,
) => {
  if (!isAuthorized(authorizedUser, ROLE_PERMISSIONS.ADD_EDIT_STATISTICS)) {
    throw new UnauthorizedError('Unauthorized for editing statistics');
  }

  const oldCase = await applicationContext
    .getPersistenceGateway()
    .getCaseByDocketNumber({ applicationContext, docketNumber });

  const newCase = new Case(oldCase, { authorizedUser });
  newCase.deleteStatistic(statisticId);

  const updatedCase = await applicationContext
    .getUseCaseHelpers()
    .updateCaseAndAssociations({
      applicationContext,
      authorizedUser,
      caseToUpdate: newCase,
    });

  return new Case(updatedCase, { authorizedUser }).validate().toRawObject();
};

export const deleteDeficiencyStatisticInteractor = withLocking(
  deleteDeficiencyStatistic,
  (_applicationContext, { docketNumber }) => ({
    identifiers: [`case|${docketNumber}`],
  }),
);
