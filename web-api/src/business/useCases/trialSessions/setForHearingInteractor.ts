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

export const setForHearingInteractor = async (
  applicationContext: ServerApplicationContext,
  {
    calendarNotes,
    docketNumber,
    trialSessionId,
  }: { calendarNotes: string; docketNumber: string; trialSessionId: string },
  authorizedUser: UnknownAuthUser,
) => {
  if (!isAuthorized(authorizedUser, ROLE_PERMISSIONS.SET_FOR_HEARING)) {
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

  trialSessionEntity
    .deleteCaseFromCalendar({ docketNumber: caseEntity.docketNumber }) // we delete because it might have been manually removed
    .manuallyAddCaseToCalendar({ calendarNotes, caseEntity });

  await applicationContext.getPersistenceGateway().addCaseToHearing({
    applicationContext,
    docketNumber,
    trialSession: trialSessionEntity.validate().toRawObject(),
  });

  // retrieve the case again since we've added the mapped hearing record :)
  const updatedCase = await getCaseByDocketNumber({
    docketNumber,
  });

  return updatedCase;
};
