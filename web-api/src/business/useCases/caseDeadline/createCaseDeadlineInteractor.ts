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
import { getCaseByDocketNumber } from '@web-api/persistence/dynamo/cases/getCaseByDocketNumber';

export const createCaseDeadline = async (
  applicationContext: ServerApplicationContext,
  {
    caseDeadline,
  }: {
    caseDeadline: CaseDeadline;
  },
  authorizedUser: UnknownAuthUser,
) => {
  if (!isAuthorized(authorizedUser, ROLE_PERMISSIONS.CASE_DEADLINE)) {
    throw new UnauthorizedError('Unauthorized for create case deadline');
  }

  // Case deadline for a specific case
  const caseDetail = await applicationContext
    .getPersistenceGateway()
    .getCaseByDocketNumber({
      applicationContext,
      docketNumber: caseDeadline.docketNumber,
    });

  const newCaseDeadline = new CaseDeadline({
    ...caseDeadline,
    associatedJudge: caseDetail.associatedJudge,
    associatedJudgeId: caseDetail.associatedJudgeId,
  });

  const currentCaseEntity = new Case(caseDetail, { authorizedUser });

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

  // Consolidated cases only if lead case
  const caseDeadlines = [newCaseDeadline.validate().toRawObject()];
  if (caseDetail.docketNumber === caseDetail.leadDocketNumber) {
    caseDetail.consolidatedCases.forEach(async consolidatedCase => {
      if (consolidatedCase.docketNumber === consolidatedCase.leadDocketNumber) {
        return;
      }

      const consolidatedCaseDetail = await applicationContext
        .getPersistenceGateway()
        .getCaseMetadataByDocketNumber({
          applicationContext,
          docketNumber: caseDeadline.docketNumber,
        });

      const cDeadline = new CaseDeadline({
        ...caseDeadline,
        docketNumber: consolidatedCase.docketNumber,
        consolidatedCaseDeadlineId: newCaseDeadline.caseDeadlineId,
        associatedJudge: consolidatedCaseDetail.associatedJudge,
        associatedJudgeId: consolidatedCaseDetail.associatedJudgeId,
      });

      caseDeadlines.push(cDeadline.validate().toRawObject());

      const currentCaseEntity = new Case(caseDetail, { authorizedUser });

      const updatedCaseEntity = await applicationContext
        .getUseCaseHelpers()
        .updateCaseAutomaticBlock({
          applicationContext,
          caseEntity: currentCaseEntity,
          hasCaseDeadline: true,
        });

      await applicationContext.getUseCaseHelpers().updateCaseAndAssociations({
        applicationContext,
        authorizedUser,
        caseToUpdate: updatedCaseEntity,
      });
    });
  }

  await upsertCaseDeadlines(caseDeadlines);

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
