import {
  isAuthorized,
  ROLE_PERMISSIONS,
} from '../../../authorization/authorizationClientService';
import { TRIAL_SESSION_ELIGIBLE_CASES_BUFFER } from '../../entities/EntityConstants';
import { EligibleCase } from '../../entities/cases/EligibleCase';
import { TrialSession } from '../../entities/trialSessions/TrialSession';
import { UnauthorizedError } from '../../../errors/errors';

/**
 * get eligible cases for trial session
 *
 * @param {object} applicationContext the application context
 * @param {object} providers the providers object
 * @param {string} providers.trialSessionId the id of the trial session to get the eligible cases
 * @returns {Promise} the promise of the getEligibleCasesForTrialSession call
 */
export const getEligibleCasesForTrialSessionInteractor = async (
  applicationContext: IApplicationContext,
  { trialSessionId }: { trialSessionId: string },
) => {
  const user = applicationContext.getCurrentUser();

  if (!isAuthorized(user, ROLE_PERMISSIONS.TRIAL_SESSIONS)) {
    throw new UnauthorizedError('Unauthorized');
  }

  const trialSession = await applicationContext
    .getPersistenceGateway()
    .getTrialSessionById({
      applicationContext,
      trialSessionId,
    });

  // Some manually added cases are considered calendared even when the
  // trial session itself is not considered calendared (see issue #3254).
  let calendaredCases = [];
  if (trialSession.isCalendared === false && trialSession.caseOrder) {
    calendaredCases = await applicationContext
      .getUseCases()
      .getCalendaredCasesForTrialSessionInteractor(applicationContext, {
        trialSessionId,
      });
  }

  const trialSessionEntity = new TrialSession(trialSession, {
    applicationContext,
  });

  trialSessionEntity.validate();

  const eligibleCases = await applicationContext
    .getPersistenceGateway()
    .getEligibleCasesForTrialSession({
      applicationContext,
      limit:
        trialSessionEntity.maxCases +
        TRIAL_SESSION_ELIGIBLE_CASES_BUFFER -
        calendaredCases.length,
      skPrefix: trialSessionEntity.generateSortKeyPrefix(),
    });

  let eligibleCasesFiltered = calendaredCases
    .concat(eligibleCases)
    .map(rawCase => {
      return new EligibleCase(rawCase, { applicationContext })
        .validate()
        .toRawObject();
    });

  return eligibleCasesFiltered;
};
