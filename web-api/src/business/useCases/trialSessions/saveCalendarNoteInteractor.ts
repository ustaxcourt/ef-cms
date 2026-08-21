import { NotFoundError } from '@web-api/errors/errors';
import {
  ROLE_PERMISSIONS,
  isAuthorized,
} from '@shared/authorization/authorizationClientService';
import { ServerApplicationContext } from '@web-api/applicationContext';
import {
  RawTrialSession,
  TrialSession,
} from '@shared/business/entities/trialSessions/TrialSession';
import { UnauthorizedError } from '@web-api/errors/errors';
import { UnknownAuthUser } from '@shared/business/entities/authUser/AuthUser';
import { getTrialSessionById } from '@web-api/persistence/postgres/trialSessions/getTrialSessionById';
import { createOrUpdateTrialSessionCases } from '@web-api/persistence/postgres/trialSessions/createOrUpdateTrialSessionCases';

export const saveCalendarNoteInteractor = async (
  _applicationContext: ServerApplicationContext,
  {
    calendarNote,
    docketNumber,
    trialSessionId,
  }: { calendarNote: string; docketNumber: string; trialSessionId: string },
  authorizedUser: UnknownAuthUser,
): Promise<RawTrialSession> => {
  if (
    !isAuthorized(authorizedUser, ROLE_PERMISSIONS.ADD_CASE_TO_TRIAL_SESSION)
  ) {
    throw new UnauthorizedError('Unauthorized');
  }

  const trialSession = await getTrialSessionById({
    trialSessionId,
  });

  if (!trialSession) {
    throw new NotFoundError(`Trial session ${trialSessionId} was not found.`);
  }

  trialSession.caseOrder.forEach(_caseOrder => {
    if (_caseOrder.docketNumber === docketNumber) {
      _caseOrder.calendarNotes = calendarNote;
    }
  });

  const rawTrialSessionEntity = new TrialSession(trialSession)
    .validate()
    .toRawObject();
  await createOrUpdateTrialSessionCases({
    trialSessionCases: rawTrialSessionEntity.caseOrder.map(caseOrder => ({
      docketNumber: caseOrder.docketNumber,
      caseOrder,
      isHearing: caseOrder.isHearing,
      trialSessionId: rawTrialSessionEntity.trialSessionId,
    })),
  });

  return rawTrialSessionEntity;
};
