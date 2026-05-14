import { Case } from '@shared/business/entities/cases/Case';
import { NotFoundError } from '@web-api/errors/errors';
import {
  ROLE_PERMISSIONS,
  isAuthorized,
} from '@shared/authorization/authorizationClientService';
import { ServerApplicationContext } from '@web-api/applicationContext';
import { TrialSession } from '@shared/business/entities/trialSessions/TrialSession';
import { UnauthorizedError } from '@web-api/errors/errors';
import { UnknownAuthUser } from '@shared/business/entities/authUser/AuthUser';
import { getCaseByDocketNumber } from '@web-api/persistence/postgres/cases/getCaseByDocketNumber';
import { updateCaseAndAssociations } from '@web-api/business/useCaseHelper/caseAssociation/updateCaseAndAssociations';
import { CaseStatus } from '@shared/business/entities/EntityConstants';
import { withLocking } from '@web-api/persistence/postgres/utils/mutex';
import { getTrialSessionById } from '@web-api/persistence/postgres/trialSessions/getTrialSessionById';
import { updateTrialSession } from '@web-api/persistence/postgres/trialSessions/updateTrialSession';
import { removeCaseFromTrialSession } from '@web-api/persistence/postgres/trialSessions/removeCaseFromTrialSession';
import { deleteCasesFromTrialSession } from '@web-api/persistence/postgres/trialSessions/deleteCasesFromTrialSession';
import { CaseDTO } from '@shared/business/dto/cases/CaseDTO';

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
    caseStatus: CaseStatus;
    disposition: string;
    docketNumber: string;
    trialSessionId: string;
  },
  authorizedUser: UnknownAuthUser,
): Promise<CaseDTO> => {
  if (!isAuthorized(authorizedUser, ROLE_PERMISSIONS.TRIAL_SESSIONS)) {
    throw new UnauthorizedError('Unauthorized');
  }

  const trialSession = await getTrialSessionById({
    trialSessionId,
  });

  if (!trialSession) {
    throw new NotFoundError(`Trial session ${trialSessionId} was not found.`);
  }

  const trialSessionEntity = new TrialSession(trialSession);

  const myCase = await getCaseByDocketNumber({
    docketNumber,
  });

  const caseEntity = new Case(myCase, { authorizedUser });

  if (trialSessionEntity.isCalendared) {
    trialSessionEntity.removeCaseFromCalendar({ disposition, docketNumber });
    await removeCaseFromTrialSession({
      disposition,
      docketNumber,
      trialSessionId,
    });
    await updateTrialSession({
      trialSessionToUpdate: trialSessionEntity.validate().toRawObject(),
    });
  } else {
    trialSessionEntity.deleteCaseFromCalendar({ docketNumber });
    await deleteCasesFromTrialSession({
      docketNumbers: [docketNumber],
      trialSessionId,
    });
  }

  if (!caseEntity.isHearing(trialSessionId)) {
    caseEntity.removeFromTrial({
      associatedJudge,
      associatedJudgeId,
      changedBy: authorizedUser?.name,
      updatedCaseStatus: caseStatus,
    });

    await applicationContext
      .getUseCaseHelpers()
      .updateCaseAutomaticBlock({ caseEntity });
  } else {
    caseEntity.removeFromHearing(trialSessionId);
  }

  const updatedCase = await updateCaseAndAssociations({
    authorizedUser,
    caseToUpdate: caseEntity,
  });

  return new CaseDTO(
    new Case(updatedCase, { authorizedUser }).validate().toRawObject(),
  );
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
