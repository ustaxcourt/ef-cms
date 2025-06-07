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
import { updateCaseAndAssociations } from '@web-api/business/useCaseHelper/caseAssociation/updateCaseAndAssociations';

export const createCaseDeadline = async (
  applicationContext: ServerApplicationContext,
  { caseDeadline }: { caseDeadline: CaseDeadline },
  authorizedUser: UnknownAuthUser,
) => {
  if (!isAuthorized(authorizedUser, ROLE_PERMISSIONS.CASE_DEADLINE)) {
    throw new UnauthorizedError('Unauthorized for create case deadline');
  }

  const caseDetail = await getCaseByDocketNumber({
    docketNumber: caseDeadline.docketNumber,
  });
  let caseEntity = new Case(caseDetail, { authorizedUser });

  const newCaseDeadline = new CaseDeadline({
    ...caseDeadline,
    associatedJudge: caseEntity.associatedJudge,
    associatedJudgeId: caseEntity.associatedJudgeId,
  });

  await upsertCaseDeadlines([newCaseDeadline.validate().toRawObject()]);

  caseEntity = await applicationContext
    .getUseCaseHelpers()
    .updateCaseAutomaticBlock({
      caseEntity,
      hasCaseDeadline: true,
    });

  const result = await updateCaseAndAssociations({
    authorizedUser,
    caseToUpdate: caseEntity,
  });

  return new Case(result, { authorizedUser }).validate().toRawObject();
};

export const createCaseDeadlineInteractor = withLocking(
  createCaseDeadline,
  (_applicationContext, { caseDeadline }) => ({
    identifiers: [`case|${caseDeadline.docketNumber}`],
  }),
);
