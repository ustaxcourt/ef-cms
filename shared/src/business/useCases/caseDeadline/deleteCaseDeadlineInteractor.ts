import {
  isAuthorized,
  ROLE_PERMISSIONS,
} from '../../../authorization/authorizationClientService';
import { Case } from '../../entities/cases/Case';
import { UnauthorizedError } from '../../../errors/errors';

/**
 * deleteCaseDeadlineInteractor
 *
 * @param {object} applicationContext the application context
 * @param {object} providers the providers object
 * @param {string} providers.caseDeadlineId the id of the case deadline to delete
 * @param {string} providers.docketNumber the docket number of the case the case deadline is attached to
 * @returns {Promise} the promise of the delete call
 */
export const deleteCaseDeadlineInteractor = async (
  applicationContext: IApplicationContext,
  {
    caseDeadlineId,
    docketNumber,
  }: { caseDeadlineId: string; docketNumber: string },
) => {
  const user = applicationContext.getCurrentUser();

  if (!isAuthorized(user, ROLE_PERMISSIONS.CASE_DEADLINE)) {
    throw new UnauthorizedError('Unauthorized for deleting case deadline');
  }

  const caseToUpdate = await applicationContext
    .getPersistenceGateway()
    .getCaseByDocketNumber({ applicationContext, docketNumber });

  let updatedCase = new Case(caseToUpdate, { applicationContext });

  await applicationContext.getPersistenceGateway().deleteCaseDeadline({
    applicationContext,
    caseDeadlineId,
    docketNumber,
  });

  updatedCase = await applicationContext
    .getUseCaseHelpers()
    .updateCaseAutomaticBlock({
      applicationContext,
      caseEntity: updatedCase,
    });

  const result = await applicationContext
    .getUseCaseHelpers()
    .updateCaseAndAssociations({
      applicationContext,
      caseToUpdate: updatedCase,
    });
  return new Case(result, { applicationContext }).validate().toRawObject();
};
