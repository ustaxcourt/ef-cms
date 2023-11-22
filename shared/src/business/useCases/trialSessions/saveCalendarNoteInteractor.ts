import { NotFoundError } from '../../../../../web-api/src/errors/errors';
import {
  ROLE_PERMISSIONS,
  isAuthorized,
} from '../../../authorization/authorizationClientService';
import { TrialSession } from '../../entities/trialSessions/TrialSession';
import { UnauthorizedError } from '@web-api/errors/errors';

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
  applicationContext: IApplicationContext,
  {
    calendarNote,
    docketNumber,
    trialSessionId,
  }: { calendarNote: string; docketNumber: string; trialSessionId: string },
) => {
  const user = applicationContext.getCurrentUser();
  if (!isAuthorized(user, ROLE_PERMISSIONS.ADD_CASE_TO_TRIAL_SESSION)) {
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

  const rawTrialSessionEntity = new TrialSession(trialSession, {
    applicationContext,
  })
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
