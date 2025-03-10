import { Case } from '@shared/business/entities/cases/Case';
import { CaseDeadline } from '@shared/business/entities/CaseDeadline';
import {
  ROLE_PERMISSIONS,
  isAuthorized,
} from '@shared/authorization/authorizationClientService';
import { ServerApplicationContext } from '@web-api/applicationContext';
import { UnauthorizedError } from '@web-api/errors/errors';
import { UnknownAuthUser } from '@shared/business/entities/authUser/AuthUser';
import { upsertCaseDeadlines } from '@web-api/persistence/postgres/caseDeadlines/upsertCaseDeadlines';
import { withLocking } from '@web-api/business/useCaseHelper/acquireLock';

export const createCaseDeadline = async (
  applicationContext: ServerApplicationContext,
  {
    caseDeadline,
    handlingConsolidatedCases = false,
  }: {
    caseDeadline: CaseDeadline;
    handlingConsolidatedCases?: boolean;
  },
  authorizedUser: UnknownAuthUser,
) => {
  if (!isAuthorized(authorizedUser, ROLE_PERMISSIONS.CASE_DEADLINE)) {
    throw new UnauthorizedError('Unauthorized for create case deadline');
  }

  const caseDetail = await applicationContext
    .getPersistenceGateway()
    .getCaseByDocketNumber({
      applicationContext,
      docketNumber: caseDeadline.docketNumber,
    });

  const currentCaseEntity = new Case(caseDetail, { authorizedUser });
  const newCaseDeadline = new CaseDeadline({
    ...caseDeadline,
    associatedJudge: currentCaseEntity.associatedJudge,
    associatedJudgeId: currentCaseEntity.associatedJudgeId,
  });

  await upsertCaseDeadlines([newCaseDeadline.validate().toRawObject()]);

  const updatedCaseEntity = await applicationContext
    .getUseCaseHelpers()
    .updateCaseAutomaticBlock({
      applicationContext,
      caseEntity: currentCaseEntity,
      hasCaseDeadline: true,
    });

  const result = await applicationContext
    .getUseCaseHelpers()
    .updateCaseAndAssociations({
      applicationContext,
      authorizedUser,
      caseToUpdate: updatedCaseEntity,
    });

  const { docketNumber, leadDocketNumber, consolidatedCases } = caseDetail;
  if (!handlingConsolidatedCases && docketNumber === leadDocketNumber) {
    const ADD_DEADLINE_TO_CONSOLIDATED_CASES = consolidatedCases
      .filter(
        ({ docketNumber: ccDocketNumber }) => ccDocketNumber !== docketNumber,
      )
      .map(({ docketNumber: ccDocketNumber }) => {
        return createCaseDeadline(
          applicationContext,
          {
            caseDeadline: {
              ...caseDeadline,
              docketNumber: ccDocketNumber,
              consolidatedCaseDeadlineId: newCaseDeadline.caseDeadlineId,
            } as CaseDeadline,
            handlingConsolidatedCases: true,
          },
          authorizedUser,
        );
      });

    await Promise.all(ADD_DEADLINE_TO_CONSOLIDATED_CASES);
  }

  return new Case(result, { authorizedUser }).validate().toRawObject();
};

export async function getcreateCaseDeadlineLockInfo(
  applicationContext: ServerApplicationContext,
  { caseDeadline }: { caseDeadline: CaseDeadline },
): Promise<{
  identifiers: string[];
  ttl?: number;
}> {
  const { docketNumber, leadDocketNumber, consolidatedCases } =
    await applicationContext.getPersistenceGateway().getCaseByDocketNumber({
      applicationContext,
      docketNumber: caseDeadline.docketNumber,
    });

  const IDENTIFIERS = [`case|${caseDeadline.docketNumber}`];
  if (docketNumber !== leadDocketNumber) {
    return {
      identifiers: IDENTIFIERS,
    };
  }

  consolidatedCases.forEach(({ docketNumber }) => {
    IDENTIFIERS.push(`case|${docketNumber}`);
  });

  return {
    identifiers: [...new Set(IDENTIFIERS)],
  };
}

export const createCaseDeadlineInteractor = withLocking(
  createCaseDeadline,
  getcreateCaseDeadlineLockInfo,
);
