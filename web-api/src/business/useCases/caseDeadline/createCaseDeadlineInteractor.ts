import { Case } from '../../../../../shared/src/business/entities/cases/Case';
import { CaseDeadline } from '../../../../../shared/src/business/entities/CaseDeadline';
import {
  ROLE_PERMISSIONS,
  isAuthorized,
} from '../../../../../shared/src/authorization/authorizationClientService';
import { ServerApplicationContext } from '@web-api/applicationContext';
import { UnauthorizedError } from '@web-api/errors/errors';
import { UnknownAuthUser } from '@shared/business/entities/authUser/AuthUser';
import { createCaseDeadline as createDeadline } from '@web-api/persistence/postgres/caseDeadlines/createCaseDeadline';
import { withLocking } from '@web-api/business/useCaseHelper/acquireLock';

export const createCaseDeadline = async (
  applicationContext: ServerApplicationContext,
  { caseDeadline }: { caseDeadline: CaseDeadline },
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
  let caseEntity = new Case(caseDetail, { authorizedUser });

  const newCaseDeadline = new CaseDeadline({
    ...caseDeadline,
    associatedJudge: caseEntity.associatedJudge,
    associatedJudgeId: caseEntity.associatedJudgeId,
  });

  await createDeadline({
    caseDeadline: newCaseDeadline.validate().toRawObject(),
  });

  caseEntity = await applicationContext
    .getUseCaseHelpers()
    .updateCaseAutomaticBlock({
      applicationContext,
      caseEntity,
    });

  await applicationContext.getUseCaseHelpers().updateCaseAndAssociations({
    applicationContext,
    authorizedUser,
    caseToUpdate: caseEntity,
  });

  return newCaseDeadline;
};

export const createCaseDeadlineInteractor = withLocking(
  createCaseDeadline,
  (_applicationContext, { caseDeadline }) => ({
    identifiers: [`case|${caseDeadline.docketNumber}`],
  }),
);
