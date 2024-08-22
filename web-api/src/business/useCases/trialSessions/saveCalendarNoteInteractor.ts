import { NotFoundError } from '../../../errors/errors';
import {
  ROLE_PERMISSIONS,
  isAuthorized,
} from '../../../../../shared/src/authorization/authorizationClientService';
import { ServerApplicationContext } from '@web-api/applicationContext';
import { TrialSession } from '../../../../../shared/src/business/entities/trialSessions/TrialSession';
import { UnauthorizedError } from '@web-api/errors/errors';
import { UnknownAuthUser } from '@shared/business/entities/authUser/AuthUser';

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
  applicationContext: ServerApplicationContext,
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

  const trialSession = await applicationContext
    .getPersistenceGateway()
    .getTrialSessionById({
      applicationContext,
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

  await applicationContext.getPersistenceGateway().updateTrialSession({
    applicationContext,
    trialSessionToUpdate: rawTrialSessionEntity,
  });

  const caseDetail = await applicationContext
    .getPersistenceGateway()
    .getCaseByDocketNumber({
      applicationContext,
      docketNumber,
    });

  if (
    caseDetail.trialSessionId !== trialSessionId &&
    caseDetail.hearings?.length
  ) {
    const hearing = caseDetail.hearings.find(
      caseHearing => caseHearing.trialSessionId === trialSessionId,
    );

    if (hearing) {
      await applicationContext.getPersistenceGateway().updateCaseHearing({
        applicationContext,
        docketNumber,
        hearingToUpdate: rawTrialSessionEntity,
      });
    }
  }

  return rawTrialSessionEntity;
};
