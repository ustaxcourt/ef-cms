import { Case } from '../../entities/cases/Case';
import { NotFoundError, UnauthorizedError } from '@web-api/errors/errors';
import {
  ROLE_PERMISSIONS,
  isAuthorized,
} from '../../../authorization/authorizationClientService';
import { TrialSession } from '../../entities/trialSessions/TrialSession';
/**
 * setForHearingInteractor
 *
 * @param {object} applicationContext the application context
 * @param {object} providers the providers object
 * @param {string} providers.calendarNotes notes for why the trial session/hearing was added
 * @param {string} providers.trialSessionId the id of the trial session
 * @param {string} providers.docketNumber the docket number of the case
 * @returns {Promise} the promise of the setForHearingInteractor call
 */
export const setForHearingInteractor = async (
  applicationContext: IApplicationContext,
  {
    calendarNotes,
    docketNumber,
    trialSessionId,
  }: { calendarNotes: string; docketNumber: string; trialSessionId: string },
) => {
  const user = applicationContext.getCurrentUser();

  if (!isAuthorized(user, ROLE_PERMISSIONS.SET_FOR_HEARING)) {
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

  const caseDetails = await applicationContext
    .getPersistenceGateway()
    .getCaseByDocketNumber({
      applicationContext,
      docketNumber,
    });

  const caseEntity = new Case(caseDetails, { applicationContext });

  const trialSessionEntity = new TrialSession(trialSession, {
    applicationContext,
  });

  const existingTrialSessionIds = [];
  if (caseEntity.trialSessionId) {
    existingTrialSessionIds.push(caseEntity.trialSessionId);
    caseEntity.hearings.forEach(_trialSession => {
      existingTrialSessionIds.push(_trialSession.trialSessionId);
    });
  }

  if (existingTrialSessionIds.includes(trialSessionId)) {
    throw new Error('That Hearing is already assigned to the Case');
  }

  trialSessionEntity
    .deleteCaseFromCalendar({ docketNumber: caseEntity.docketNumber }) // we delete because it might have been manually removed
    .manuallyAddCaseToCalendar({ calendarNotes, caseEntity });

  await applicationContext.getPersistenceGateway().addCaseToHearing({
    applicationContext,
    docketNumber,
    trialSession: trialSessionEntity.validate().toRawObject(),
  });

  // retrieve the case again since we've added the mapped hearing record :)
  const updatedCase = await applicationContext
    .getPersistenceGateway()
    .getCaseByDocketNumber({
      applicationContext,
      docketNumber,
    });

  return updatedCase;
};
