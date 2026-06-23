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
import { getCaseDeadlinesByConsolidatedCaseDeadlineIds } from '@web-api/persistence/postgres/caseDeadlines/getCaseDeadlinesByConsolidatedCaseDeadlineIds';
import { updateCaseAndAssociations } from '@web-api/business/useCaseHelper/caseAssociation/updateCaseAndAssociations';
import { withLocking } from '@web-api/persistence/postgres/utils/mutex';
import { withTransaction } from '@web-api/persistence/postgres/utils/transactions';

export const deleteCaseDeadline = async (
  _applicationContext: ServerApplicationContext,
  {
    caseDeadlineId,
    docketNumber,
  }: {
    caseDeadlineId: string;
    docketNumber: string;
  },
  authorizedUser: UnknownAuthUser,
): Promise<void> => {
  if (!isAuthorized(authorizedUser, ROLE_PERMISSIONS.CASE_DEADLINE)) {
    throw new UnauthorizedError('Unauthorized for deleting case deadline');
  }

  const caseToUpdate = await getCaseByDocketNumber({
    docketNumber,
  });

  let updatedCase = new Case(caseToUpdate, { authorizedUser });

  // To avoid race conditions such that we delete a deadline from one DB endpoint but then read immediately from another (which doesn't yet have the update),
  // we keep track of the deadlines in code and pass the info into updateCaseAutomaticBlocked
  const deadlinesBeforeDelete = await getCaseDeadlinesByDocketNumber({
    docketNumber,
  });

  const HANDLED_CASE_DEADLINE = deadlinesBeforeDelete.find(
    cd => cd.caseDeadlineId === caseDeadlineId,
  );

  await withTransaction(async () => {
    await deleteDeadline({
      caseDeadlineId,
    });

    updatedCase = await updateCaseAutomaticBlock({
      caseEntity: updatedCase,
      hasCaseDeadline: deadlinesBeforeDelete.length > 1,
    });

    await updateCaseAndAssociations({
      authorizedUser,
      caseToUpdate: updatedCase,
    });

    const { leadDocketNumber } = caseToUpdate;

    if (!leadDocketNumber) {
      return;
    }

    if (
      !HANDLED_CASE_DEADLINE ||
      HANDLED_CASE_DEADLINE?.consolidatedCaseDeadlineId
    ) {
      return;
    }

    const CONSOLIDATED_CASE_DEADLINE =
      await getCaseDeadlinesByConsolidatedCaseDeadlineIds([caseDeadlineId]);

    const DELETE_DEADLINE_TO_CONSOLIDATED_CASES =
      CONSOLIDATED_CASE_DEADLINE.filter(
        ({ docketNumber: ccDocketNumber }) => ccDocketNumber !== docketNumber,
      ).map(({ docketNumber: ccDocketNumber, caseDeadlineId }) => {
        return deleteCaseDeadline(
          _applicationContext,
          {
            caseDeadlineId,
            docketNumber: ccDocketNumber,
          },
          authorizedUser,
        );
      });

    await Promise.all(DELETE_DEADLINE_TO_CONSOLIDATED_CASES);
  });
};

export async function getDeleteCaseDeadlineInteractorLockInfo(
  _applicationContext: ServerApplicationContext,
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
  const { leadDocketNumber } = await getCaseByDocketNumber({
    docketNumber,
  });

  const IDENTIFIERS = [`case|${docketNumber}`];
  if (!leadDocketNumber) {
    return {
      identifiers: IDENTIFIERS,
    };
  }

  const CONSOLIDATED_CASE_DEADLINE =
    await getCaseDeadlinesByConsolidatedCaseDeadlineIds([caseDeadlineId]);

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
