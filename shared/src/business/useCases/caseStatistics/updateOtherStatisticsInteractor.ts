import {
  isAuthorized,
  ROLE_PERMISSIONS,
} from '../../../authorization/authorizationClientService';
import { Case } from '../../entities/cases/Case';
import { UnauthorizedError } from '../../../errors/errors';

/**
 * updateOtherStatisticsInteractor
 *
 * @param {object} applicationContext the application context
 * @param {object} providers the providers object
 * @param {string} providers.docketNumber the docket number of the case to update statistics
 * @param {number} providers.damages damages statistic to add to the case
 * @param {number} providers.litigationCosts litigation costs statistic to add to the case
 * @returns {object} the updated case
 */
export const updateOtherStatisticsInteractor = async (
  applicationContext: IApplicationContext,
  {
    damages,
    docketNumber,
    litigationCosts,
  }: { damages: number; docketNumber: string; litigationCosts: number },
) => {
  const user = applicationContext.getCurrentUser();

  if (!isAuthorized(user, ROLE_PERMISSIONS.ADD_EDIT_STATISTICS)) {
    throw new UnauthorizedError('Unauthorized for editing statistics');
  }

  const oldCase = await applicationContext
    .getPersistenceGateway()
    .getCaseByDocketNumber({ applicationContext, docketNumber });

  const newCase = new Case(
    { ...oldCase, damages, litigationCosts },
    { applicationContext },
  );

  const updatedCase = await applicationContext
    .getUseCaseHelpers()
    .updateCaseAndAssociations({
      applicationContext,
      caseToUpdate: newCase,
    });

  return new Case(updatedCase, { applicationContext }).validate().toRawObject();
};
