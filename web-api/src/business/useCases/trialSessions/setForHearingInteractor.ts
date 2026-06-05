import { Case } from '@shared/business/entities/cases/Case';
import { NotFoundError } from '../../../errors/errors';
import {
  ROLE_PERMISSIONS,
  isAuthorized,
} from '@shared/authorization/authorizationClientService';
import { ServerApplicationContext } from '@web-api/applicationContext';
import { TrialSession } from '@shared/business/entities/trialSessions/TrialSession';
import { UnauthorizedError } from '@web-api/errors/errors';
import { UnknownAuthUser } from '@shared/business/entities/authUser/AuthUser';
import { getCaseByDocketNumber } from '@web-api/persistence/postgres/cases/getCaseByDocketNumber';
import { getTrialSessionById } from '@web-api/persistence/postgres/trialSessions/getTrialSessionById';
import { createOrUpdateTrialSessionCases } from '@web-api/persistence/postgres/trialSessions/createOrUpdateTrialSessionCases';

export const setForHearingInteractor = async (
  _applicationContext: ServerApplicationContext,
  {
    calendarNotes,
    docketNumber,
    trialSessionId,
  }: { calendarNotes: string; docketNumber: string; trialSessionId: string },
  authorizedUser: UnknownAuthUser,
): Promise<void> => {
  if (!isAuthorized(authorizedUser, ROLE_PERMISSIONS.SET_FOR_HEARING)) {
    throw new UnauthorizedError('Unauthorized');
  }

  const trialSession = await getTrialSessionById({
    trialSessionId,
  });

  if (!trialSession) {
    throw new NotFoundError(`Trial session ${trialSessionId} was not found.`);
  }

  const caseDetails = await getCaseByDocketNumber({
    docketNumber,
  });

  const caseEntity = new Case(caseDetails, { authorizedUser });

  const trialSessionEntity = new TrialSession(trialSession);

  const existingTrialSessionIds: string[] = [];
  if (caseEntity.trialSessionId) {
    existingTrialSessionIds.push(caseEntity.trialSessionId);
    caseEntity.hearings.forEach(_trialSession => {
      existingTrialSessionIds.push(_trialSession.trialSessionId);
    });
  }

  if (existingTrialSessionIds.includes(trialSessionId)) {
    throw new Error('That Hearing is already assigned to the Case');
  }

  // Removing and adding the case in memory to match the change we will make in the DB
  trialSessionEntity.deleteCaseFromCalendar({
    docketNumber: caseEntity.docketNumber,
  });
  const caseOrder = trialSessionEntity.manuallyAddCaseToCalendar({
    calendarNotes,
    caseEntity,
    isHearing: true,
  });

  await createOrUpdateTrialSessionCases({
    trialSessionCases: [
      {
        docketNumber,
        caseOrder,
        trialSessionId,
        isHearing: true,
      },
    ],
  });
};
