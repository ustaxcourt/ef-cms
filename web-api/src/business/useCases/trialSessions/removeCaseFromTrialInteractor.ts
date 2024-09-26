import { Case } from '../../../../../shared/src/business/entities/cases/Case';
import { NotFoundError } from '../../../errors/errors';
import {
  ROLE_PERMISSIONS,
  isAuthorized,
} from '../../../../../shared/src/authorization/authorizationClientService';
import { ServerApplicationContext } from '@web-api/applicationContext';
import { TrialSession } from '../../../../../shared/src/business/entities/trialSessions/TrialSession';
import { UnauthorizedError } from '@web-api/errors/errors';
import { UnknownAuthUser } from '@shared/business/entities/authUser/AuthUser';
import { withLocking } from '@web-api/business/useCaseHelper/acquireLock';
import { setPriorityOnAllWorkItems } from '@web-api/persistence/postgres/workitems/setPriorityOnAllWorkItems';

export const removeCaseFromTrial = async (
  applicationContext: ServerApplicationContext,
  {
    associatedJudge,
    associatedJudgeId,
    caseStatus,
    disposition,
    docketNumber,
    trialSessionId,
  }: {
    associatedJudge: string;
    associatedJudgeId: string;
    caseStatus: string;
    disposition: string;
    docketNumber: string;
    trialSessionId: string;
  },
  authorizedUser: UnknownAuthUser,
) => {
  if (!isAuthorized(authorizedUser, ROLE_PERMISSIONS.TRIAL_SESSIONS)) {
    throw new UnauthorizedError('Unauthorized');
  }

  const trialSession = await applicationContext
    .getPersistenceGateway()
    .getTrialSessionById({
      applicationContext,
      trialSessionId,
    });

  if (!trialSession) {
    throw new NotFoundError(`Trial session ${trialSessionId} was not found.`);
  }

  const trialSessionEntity = new TrialSession(trialSession);

  if (trialSessionEntity.isCalendared) {
    trialSessionEntity.removeCaseFromCalendar({ disposition, docketNumber });
  } else {
    trialSessionEntity.deleteCaseFromCalendar({ docketNumber });
  }

  await applicationContext.getPersistenceGateway().updateTrialSession({
    applicationContext,
    trialSessionToUpdate: trialSessionEntity.validate().toRawObject(),
  });

  const myCase = await applicationContext
    .getPersistenceGateway()
    .getCaseByDocketNumber({
      applicationContext,
      docketNumber,
    });

  const caseEntity = new Case(myCase, { authorizedUser });

  if (!caseEntity.isHearing(trialSessionId)) {
    caseEntity.removeFromTrial({
      associatedJudge,
      associatedJudgeId,
      changedBy: authorizedUser?.name,
      updatedCaseStatus: caseStatus,
    });

    await setPriorityOnAllWorkItems({
      docketNumber: caseEntity.docketNumber,
      highPriority: false,
    });

    if (caseEntity.isReadyForTrial()) {
      await applicationContext
        .getPersistenceGateway()
        .createCaseTrialSortMappingRecords({
          applicationContext,
          caseSortTags: caseEntity.generateTrialSortTags(),
          docketNumber: caseEntity.docketNumber,
        });
    }

    await applicationContext
      .getUseCaseHelpers()
      .updateCaseAutomaticBlock({ applicationContext, caseEntity });
  } else {
    caseEntity.removeFromHearing(trialSessionId);
  }

  const updatedCase = await applicationContext
    .getUseCaseHelpers()
    .updateCaseAndAssociations({
      applicationContext,
      authorizedUser,
      caseToUpdate: caseEntity,
    });

  return new Case(updatedCase, { authorizedUser }).validate().toRawObject();
};

export const removeCaseFromTrialInteractor = withLocking(
  removeCaseFromTrial,
  (
    _applicationContext: ServerApplicationContext,
    { docketNumber }: { docketNumber: string },
  ) => ({
    identifiers: [`case|${docketNumber}`],
  }),
);
