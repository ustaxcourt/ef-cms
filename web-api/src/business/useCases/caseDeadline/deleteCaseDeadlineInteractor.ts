import { Case } from '../../../../../shared/src/business/entities/cases/Case';
import {
  ROLE_PERMISSIONS,
  isAuthorized,
} from '../../../../../shared/src/authorization/authorizationClientService';
import { ServerApplicationContext } from '@web-api/applicationContext';
import { UnauthorizedError } from '@web-api/errors/errors';
import { UnknownAuthUser } from '@shared/business/entities/authUser/AuthUser';
import { deleteCaseDeadline as deleteDeadline } from '@web-api/persistence/postgres/caseDeadlines/deleteCaseDeadline';
import { withLocking } from '@web-api/business/useCaseHelper/acquireLock';

export const deleteCaseDeadline = async (
  applicationContext: ServerApplicationContext,
  {
    caseDeadlineId,
    docketNumber,
  }: { caseDeadlineId: string; docketNumber: string },
  authorizedUser: UnknownAuthUser,
) => {
  if (!isAuthorized(authorizedUser, ROLE_PERMISSIONS.CASE_DEADLINE)) {
    throw new UnauthorizedError('Unauthorized for deleting case deadline');
  }

  const caseToUpdate = await applicationContext
    .getPersistenceGateway()
    .getCaseByDocketNumber({ applicationContext, docketNumber });

  let updatedCase = new Case(caseToUpdate, { authorizedUser });

  await deleteDeadline({
    caseDeadlineId,
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
      authorizedUser,
      caseToUpdate: updatedCase,
    });
  return new Case(result, { authorizedUser }).validate().toRawObject();
};

export const deleteCaseDeadlineInteractor = withLocking(
  deleteCaseDeadline,
  (_applicationContext, { docketNumber }) => ({
    identifiers: [`case|${docketNumber}`],
  }),
);
