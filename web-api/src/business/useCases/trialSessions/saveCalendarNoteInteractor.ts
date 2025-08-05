import { NotFoundError } from '@web-api/errors/errors';
import {
  ROLE_PERMISSIONS,
  isAuthorized,
} from '@shared/authorization/authorizationClientService';
import { ServerApplicationContext } from '@web-api/applicationContext';
import { TrialSession } from '@shared/business/entities/trialSessions/TrialSession';
import { UnauthorizedError } from '@web-api/errors/errors';
import { UnknownAuthUser } from '@shared/business/entities/authUser/AuthUser';
import { getTrialSessionById } from '@web-api/persistence/postgres/trialSessions/getTrialSessionById';
import { createOrUpdateTrialSessionCases } from '@web-api/persistence/postgres/trialSessions/createOrUpdateTrialSessionCases';

/**
 * saveCalendarNoteInteractor
 *
 * @param {object} applicationContext the application context
 * @param {object} providers the providers object
 * @param {string} providers.calendarNote the note to update
 * @param {string} providers.docketNumber the docket number of the case to update calendar note
 * @param {string} providers.trialSessionId the id of the trial session containing the case with the note
 * @returns {object} trial session entity
 */
export const saveCalendarNoteInteractor = async (
  _applicationContext: ServerApplicationContext,
  {
    calendarNote,
    docketNumber,
    trialSessionId,
  }: { calendarNote: string; docketNumber: string; trialSessionId: string },
  authorizedUser: UnknownAuthUser,
) => {
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
