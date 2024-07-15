import { CaseDeadline } from '../../../../../shared/src/business/entities/CaseDeadline';
import {
  ROLE_PERMISSIONS,
  isAuthorized,
} from '../../../../../shared/src/authorization/authorizationClientService';
import { ServerApplicationContext } from '@web-api/applicationContext';
import { UnauthorizedError } from '@web-api/errors/errors';
import { UnknownAuthUser } from '@shared/business/entities/authUser/AuthUser';

export const updateCaseDeadlineInteractor = async (
  applicationContext: ServerApplicationContext,
  { caseDeadline }: { caseDeadline: CaseDeadline },
  authorizedUser: UnknownAuthUser,
) => {
  if (!isAuthorized(authorizedUser, ROLE_PERMISSIONS.CASE_DEADLINE)) {
    throw new UnauthorizedError('Unauthorized for updating case deadline');
  }

  const caseDeadlineToUpdate = new CaseDeadline(caseDeadline, {
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
