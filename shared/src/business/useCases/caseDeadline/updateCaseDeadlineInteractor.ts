import { CaseDeadline } from '../../entities/CaseDeadline';
import {
  ROLE_PERMISSIONS,
  isAuthorized,
} from '../../../authorization/authorizationClientService';
import { UnauthorizedError } from '@web-api/errors/errors';

/**
 * updateCaseDeadlineInteractor
 *
 * @param {object} applicationContext the application context
 * @param {object} providers the providers object
 * @param {object} providers.caseDeadline the case deadline data
 * @returns {object} the updated case deadline
 */
export const updateCaseDeadlineInteractor = async (
  applicationContext: IApplicationContext,
  { caseDeadline }: { caseDeadline: CaseDeadline },
) => {
  const user = applicationContext.getCurrentUser();

  if (!isAuthorized(user, ROLE_PERMISSIONS.CASE_DEADLINE)) {
    throw new UnauthorizedError('Unauthorized for updating case deadline');
  }

  let caseDeadlineToUpdate = new CaseDeadline(caseDeadline, {
    applicationContext,
  })
    .validate()
    .toRawObject();

  await applicationContext.getPersistenceGateway().deleteCaseDeadline({
    applicationContext,
    caseDeadlineId: caseDeadlineToUpdate.caseDeadlineId,
    docketNumber: caseDeadlineToUpdate.docketNumber,
  });

  await applicationContext.getPersistenceGateway().createCaseDeadline({
    applicationContext,
    caseDeadline: caseDeadlineToUpdate,
  });

  return caseDeadlineToUpdate;
};
