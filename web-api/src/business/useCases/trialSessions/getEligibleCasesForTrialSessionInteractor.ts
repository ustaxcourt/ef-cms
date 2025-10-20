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
import {
  dateStringsCompared,
  calculateISODate,
  createISODateString,
} from '@shared/business/utilities/DateHandler';
import { CASE_STATUS_TYPES } from '@shared/business/entities/EntityConstants';

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

  const eligibleCasesWithFilingDate = eligibleCases.map(eligibleCase => {
    console.log('c: ', { ...eligibleCase, docketEntries: undefined });
    let isAgedCase: boolean;
    if (
      [
        CASE_STATUS_TYPES.closed,
        CASE_STATUS_TYPES.closedDismissed,
        CASE_STATUS_TYPES.onAppeal,
      ].some(status => eligibleCase.status === status)
    ) {
      isAgedCase = false;
    } else {
      const filingDate =
        eligibleCase.docketEntries
          .map(docketEntry => docketEntry.filingDate)
          .sort((a, b) => dateStringsCompared(b, a))[0] ||
        createISODateString();
      isAgedCase =
        dateStringsCompared(
          filingDate,
          calculateISODate({
            dateString: createISODateString(),
            howMuch: -365,
          }),
        ) < 0;
    }
    return {
      ...eligibleCase,
      isAgedCase,
    };
  });

  const eligibleCasesFiltered = calendaredCases
    .concat(eligibleCasesWithFilingDate)
    .map(rawCase => {
      return new EligibleCase(rawCase).validate().toRawObject();
    });

  return eligibleCasesFiltered;
};
