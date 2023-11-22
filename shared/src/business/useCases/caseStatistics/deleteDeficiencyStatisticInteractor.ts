import { Case } from '../../entities/cases/Case';
import {
  ROLE_PERMISSIONS,
  isAuthorized,
} from '../../../authorization/authorizationClientService';
import { UnauthorizedError } from '@web-api/errors/errors';
import { withLocking } from '@shared/business/useCaseHelper/acquireLock';

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
  applicationContext: IApplicationContext,
  { docketNumber, statisticId }: { docketNumber: string; statisticId: string },
) => {
  const user = applicationContext.getCurrentUser();

  if (!isAuthorized(user, ROLE_PERMISSIONS.ADD_EDIT_STATISTICS)) {
    throw new UnauthorizedError('Unauthorized for editing statistics');
  }

  const oldCase = await applicationContext
    .getPersistenceGateway()
    .getCaseByDocketNumber({ applicationContext, docketNumber });

  const newCase = new Case(oldCase, { applicationContext });
  newCase.deleteStatistic(statisticId);

  const updatedCase = await applicationContext
    .getUseCaseHelpers()
    .updateCaseAndAssociations({
      applicationContext,
      caseToUpdate: newCase,
    });

  return new Case(updatedCase, { applicationContext }).validate().toRawObject();
};

export const deleteDeficiencyStatisticInteractor = withLocking(
  deleteDeficiencyStatistic,
  (_applicationContext, { docketNumber }) => ({
    identifiers: [`case|${docketNumber}`],
  }),
);
