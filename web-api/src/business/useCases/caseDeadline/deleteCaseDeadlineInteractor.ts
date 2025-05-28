import { Case } from '@shared/business/entities/cases/Case';
import {
  ROLE_PERMISSIONS,
  isAuthorized,
} from '@shared/authorization/authorizationClientService';
import { ServerApplicationContext } from '@web-api/applicationContext';
import { UnauthorizedError } from '@web-api/errors/errors';
import { UnknownAuthUser } from '@shared/business/entities/authUser/AuthUser';
import { getCaseByDocketNumber } from '@web-api/persistence/postgres/cases/getCaseByDocketNumber';
import { deleteCaseDeadline as deleteDeadline } from '@web-api/persistence/postgres/caseDeadlines/deleteCaseDeadline';
import { getCaseDeadlinesByDocketNumber } from '@web-api/persistence/postgres/caseDeadlines/getCaseDeadlinesByDocketNumber';
import { updateCaseAutomaticBlock } from '@web-api/business/useCaseHelper/automaticBlock/updateCaseAutomaticBlock';
import { withLocking } from '@web-api/persistence/postgres/utils/mutex';

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

  const caseToUpdate = await getCaseByDocketNumber({
    applicationContext,
    docketNumber,
  });

  let updatedCase = new Case(caseToUpdate, { authorizedUser });

  // To avoid race conditions such that we delete a deadline from one DB endpoint but then read immediately from another (which doesn't yet have the update),
  // we keep track of the deadlines in code and pass the info into updateCaseAutomaticBlocked
  const deadlinesBeforeDelete = await getCaseDeadlinesByDocketNumber({
    docketNumber,
  });

  await deleteDeadline({
    caseDeadlineId,
  });

  updatedCase = await updateCaseAutomaticBlock({
    applicationContext,
    caseEntity: updatedCase,
    hasCaseDeadline: deadlinesBeforeDelete.length > 1,
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
