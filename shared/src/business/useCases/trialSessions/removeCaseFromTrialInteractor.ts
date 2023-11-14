import { Case } from '../../entities/cases/Case';
import { NotFoundError, UnauthorizedError } from '@web-api/errors/errors';
import {
  ROLE_PERMISSIONS,
  isAuthorized,
} from '../../../authorization/authorizationClientService';
import { TrialSession } from '../../entities/trialSessions/TrialSession';
import { withLocking } from '@shared/business/useCaseHelper/acquireLock';

export const removeCaseFromTrial = async (
  applicationContext: IApplicationContext,
  {
    associatedJudge,
    caseStatus,
    disposition,
    docketNumber,
    trialSessionId,
  }: {
    associatedJudge: string;
    caseStatus: string;
    disposition: string;
    docketNumber: string;
    trialSessionId: string;
  },
) => {
  const user = applicationContext.getCurrentUser();

  if (!isAuthorized(user, ROLE_PERMISSIONS.TRIAL_SESSIONS)) {
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

  const trialSessionEntity = new TrialSession(trialSession, {
    applicationContext,
  });

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

  const caseEntity = new Case(myCase, { applicationContext });

  if (!caseEntity.isHearing(trialSessionId)) {
    caseEntity.removeFromTrial({
      associatedJudge,
      changedBy: user.name,
      updatedCaseStatus: caseStatus,
    });

    await applicationContext.getPersistenceGateway().setPriorityOnAllWorkItems({
      applicationContext,
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
      caseToUpdate: caseEntity,
    });

  return new Case(updatedCase, { applicationContext }).validate().toRawObject();
};

export const removeCaseFromTrialInteractor = withLocking(
  removeCaseFromTrial,
  (
    _applicationContext: IApplicationContext,
    { docketNumber }: { docketNumber: string },
  ) => ({
    identifiers: [`case|${docketNumber}`],
  }),
);
