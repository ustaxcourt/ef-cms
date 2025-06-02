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
import { withLocking } from '@web-api/business/useCaseHelper/acquireLock';
import { getCaseDeadlinesByDocketNumber } from '@web-api/persistence/postgres/caseDeadlines/getCaseDeadlinesByDocketNumber';
import { updateCaseAutomaticBlock } from '@web-api/business/useCaseHelper/automaticBlock/updateCaseAutomaticBlock';
import { getCaseDeadlinesByConsolidatedCaseDeadlineId } from '@web-api/persistence/postgres/caseDeadlines/getCaseDeadlinesByConsolidatedCaseDeadlineId';

export const deleteCaseDeadline = async (
  applicationContext: ServerApplicationContext,
  {
    caseDeadlineId,
    docketNumber,
    handlingConsolidatedCases = false,
  }: {
    caseDeadlineId: string;
    docketNumber: string;
    handlingConsolidatedCases?: boolean;
  },
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

  const { leadDocketNumber } = caseToUpdate;
  if (!handlingConsolidatedCases && docketNumber === leadDocketNumber) {
    const CONSOLIDATED_CASE_DEADLINE =
      await getCaseDeadlinesByConsolidatedCaseDeadlineId(
        caseDeadlineId,
        leadDocketNumber,
      );

    const DELETE_DEADLINE_TO_CONSOLIDATED_CASES =
      CONSOLIDATED_CASE_DEADLINE.filter(
        ({ docketNumber: ccDocketNumber }) => ccDocketNumber !== docketNumber,
      ).map(({ docketNumber: ccDocketNumber, caseDeadlineId }) => {
        return deleteCaseDeadline(
          applicationContext,
          {
            caseDeadlineId,
            docketNumber: ccDocketNumber,
            handlingConsolidatedCases: true,
          },
          authorizedUser,
        );
      });

    await Promise.all(DELETE_DEADLINE_TO_CONSOLIDATED_CASES);
  }
  return new Case(result, { authorizedUser }).validate().toRawObject();
};

export async function getDeleteCaseDeadlineInteractorLockInfo(
  applicationContext: ServerApplicationContext,
  {
    caseDeadlineId,
    docketNumber,
  }: {
    caseDeadlineId: string;
    docketNumber: string;
  },
): Promise<{
  identifiers: string[];
  ttl?: number;
}> {
  const { leadDocketNumber } = await applicationContext
    .getPersistenceGateway()
    .getCaseByDocketNumber({ applicationContext, docketNumber });

  const IDENTIFIERS = [`case|${docketNumber}`];
  if (!leadDocketNumber) {
    return {
      identifiers: IDENTIFIERS,
    };
  }

  const CONSOLIDATED_CASE_DEADLINE =
    await getCaseDeadlinesByConsolidatedCaseDeadlineId(
      caseDeadlineId,
      leadDocketNumber,
    );

  CONSOLIDATED_CASE_DEADLINE.forEach(({ docketNumber: cdlDocketNumber }) => {
    IDENTIFIERS.push(`case|${cdlDocketNumber}`);
  });

  return {
    identifiers: [...new Set(IDENTIFIERS)],
  };
}

export const deleteCaseDeadlineInteractor = withLocking(
  deleteCaseDeadline,
  getDeleteCaseDeadlineInteractorLockInfo,
);
