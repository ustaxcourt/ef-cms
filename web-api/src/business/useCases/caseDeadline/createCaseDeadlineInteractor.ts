import { Case } from '@shared/business/entities/cases/Case';
import { CaseDeadline } from '@shared/business/entities/CaseDeadline';
import {
  ROLE_PERMISSIONS,
  isAuthorized,
} from '@shared/authorization/authorizationClientService';
import { ServerApplicationContext } from '@web-api/applicationContext';
import { UnauthorizedError } from '@web-api/errors/errors';
import { UnknownAuthUser } from '@shared/business/entities/authUser/AuthUser';
import { getCaseByDocketNumber } from '@web-api/persistence/postgres/cases/getCaseByDocketNumber';
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
  let startTime = Date.now();
  const getElapsedTime = () => {
    const elapsedTime = (Date.now() - startTime) / 1000;
    startTime = Date.now();
    return `[${elapsedTime.toFixed(4)}s]`;
  };

  if (!isAuthorized(authorizedUser, ROLE_PERMISSIONS.CASE_DEADLINE)) {
    throw new UnauthorizedError('Unauthorized for create case deadline');
  }

  const PREPEND_STRING = handlingConsolidatedCases ? '********** ' : '***** ';

  console.log(
    PREPEND_STRING + 'STARTING createCaseDeadline ' + getElapsedTime(),
  );
  console.log(
    PREPEND_STRING + 'caseDeadline.docketNumber',
    caseDeadline.docketNumber,
    getElapsedTime(),
  );
  console.log(
    PREPEND_STRING + 'handlingConsolidatedCases',
    handlingConsolidatedCases,
    getElapsedTime(),
  );

  const caseDetail = await getCaseByDocketNumber({
    applicationContext,
    docketNumber: caseDeadline.docketNumber,
  });

  console.log(PREPEND_STRING + 'got case detail ' + getElapsedTime());

  const currentCaseEntity = new Case(caseDetail, { authorizedUser });

  console.log(PREPEND_STRING + 'Entitified the case ' + getElapsedTime());

  const newCaseDeadline = new CaseDeadline({
    ...caseDeadline,
    associatedJudge: currentCaseEntity.associatedJudge,
    associatedJudgeId: currentCaseEntity.associatedJudgeId,
  });

  console.log(PREPEND_STRING + 'Entitified the deadline ' + getElapsedTime());

  await upsertCaseDeadlines([newCaseDeadline.validate().toRawObject()]);

  console.log(
    PREPEND_STRING + 'Upserted the case deadline ' + getElapsedTime(),
  );

  const updatedCaseEntity = await applicationContext
    .getUseCaseHelpers()
    .updateCaseAutomaticBlock({
      applicationContext,
      caseEntity: currentCaseEntity,
      hasCaseDeadline: true,
    });

  console.log(
    PREPEND_STRING + 'Updated Case Automatic Block ' + getElapsedTime(),
  );

  const result = await applicationContext
    .getUseCaseHelpers()
    .updateCaseAndAssociations({
      applicationContext,
      authorizedUser,
      caseToUpdate: updatedCaseEntity,
    });

  console.log(
    PREPEND_STRING + 'Updated Case And Associations ' + getElapsedTime(),
  );

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

  console.log(
    PREPEND_STRING + 'Handled Children cases in CG ' + getElapsedTime(),
  );
  console.log(PREPEND_STRING + 'COMPLETE returning case ' + getElapsedTime());

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
    await getCaseByDocketNumber({
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
