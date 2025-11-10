import { EligibleCase } from '@shared/business/entities/cases/EligibleCase';
import { NotFoundError } from '../../../errors/errors';
import {
  ROLE_PERMISSIONS,
  isAuthorized,
} from '@shared/authorization/authorizationClientService';
import { ServerApplicationContext } from '@web-api/applicationContext';
import { TrialSession } from '@shared/business/entities/trialSessions/TrialSession';
import { UnauthorizedError } from '@web-api/errors/errors';
import { UnknownAuthUser } from '@shared/business/entities/authUser/AuthUser';
import { getTrialSessionById } from '@web-api/persistence/postgres/trialSessions/getTrialSessionById';
import { getCalendaredCasesForTrialSession } from '@web-api/persistence/postgres/trialSessions/getCalendaredCasesForTrialSession';
import { getEligibleCasesWithIsAgedCase } from '@shared/business/useCaseHelper/getEligibleCasesWithIsAgedCase';

/**
 * get eligible cases for trial session
 *
 * @param {object} applicationContext the application context
 * @param {object} providers the providers object
 * @param {string} providers.trialSessionId the id of the trial session to get the eligible cases
 * @returns {Promise} the promise of the getEligibleCasesForTrialSession call
 */
export const getEligibleCasesForTrialSessionInteractor = async (
  applicationContext: ServerApplicationContext,
  { trialSessionId }: { trialSessionId: string },
  authorizedUser: UnknownAuthUser,
) => {
  if (!isAuthorized(authorizedUser, ROLE_PERMISSIONS.TRIAL_SESSIONS)) {
    throw new UnauthorizedError('Unauthorized');
  }

  const trialSession = await getTrialSessionById({
    trialSessionId,
  });

  if (!trialSession) {
    throw new NotFoundError(`Trial session ${trialSessionId} was not found.`);
  }

  // Some manually added cases are considered calendared even when the
  // trial session itself is not considered calendared (see issue #3254).
  let calendaredCases: Omit<RawCase, 'consolidatedCases'>[] = [];
  if (trialSession.isCalendared === false && trialSession.caseOrder) {
    calendaredCases = await getCalendaredCasesForTrialSession({
      trialSessionId,
    });
  }

  const trialSessionEntity = new TrialSession(trialSession);

  trialSessionEntity.validate();

  const eligibleCases = await applicationContext
    .getPersistenceGateway()
    .getEligibleCasesForTrialSession({
      sessionType: trialSessionEntity.getCaseProcedureForTrial(),
      trialCity: trialSessionEntity.trialLocation!,
    });

  const eligibleCasesWithIsAgedCase = getEligibleCasesWithIsAgedCase([
    ...calendaredCases,
    ...eligibleCases,
  ]);

  const eligibleCasesFiltered = eligibleCasesWithIsAgedCase.map(rawCase => {
    return new EligibleCase(rawCase).validate().toRawObject();
  });

  return eligibleCasesFiltered;
};
