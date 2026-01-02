import { Case } from '@shared/business/entities/cases/Case';
import {
  ROLE_PERMISSIONS,
  isAuthorized,
} from '@shared/authorization/authorizationClientService';
import { TrialSession } from '@shared/business/entities/trialSessions/TrialSession';
import { UnauthorizedError, NotFoundError } from '@web-api/errors/errors';
import { UnknownAuthUser } from '@shared/business/entities/authUser/AuthUser';
import { getCaseByDocketNumber } from '@web-api/persistence/postgres/cases/getCaseByDocketNumber';
import { getMinuteSheetsByTrialSession } from '@web-api/persistence/postgres/minuteSheets/getMinuteSheetsByTrialSession';
import { getTrialSessionById } from '@web-api/persistence/postgres/trialSessions/getTrialSessionById';

export type UnscheduledMinuteSheetInfo = {
  docketNumber: string;
  docketNumberWithSuffix: string;
  caseCaption: string;
};

/**
 * Gets minute sheets for cases that are NOT on the trial session calendar.
 * These are minute sheets created for unscheduled cases heard ad hoc.
 *
 * @param {object} params the params object
 * @param {string} params.trialSessionId the id of the trial session
 * @param {object} authorizedUser the user making the request
 * @returns {Promise<UnscheduledMinuteSheetInfo[]>} list of unscheduled minute sheet case info
 */
export const getUnscheduledMinuteSheetsInteractor = async (
  { trialSessionId }: { trialSessionId: string },
  authorizedUser: UnknownAuthUser,
): Promise<UnscheduledMinuteSheetInfo[]> => {
  if (!isAuthorized(authorizedUser, ROLE_PERMISSIONS.MANAGE_MINUTE_SHEET)) {
    throw new UnauthorizedError('Unauthorized');
  }

  const trialSession = await getTrialSessionById({ trialSessionId });

  if (!trialSession) {
    throw new NotFoundError(`Trial session ${trialSessionId} was not found.`);
  }

  const trialSessionEntity = new TrialSession(trialSession);

  // Get all minute sheets for this trial session
  const allMinuteSheets = await getMinuteSheetsByTrialSession({
    trialSessionId,
  });

  if (allMinuteSheets.length === 0) {
    return [];
  }

  // Filter to only unscheduled minute sheets (cases NOT on the trial session calendar)
  const unscheduledMinuteSheets = allMinuteSheets.filter(minuteSheet => {
    return !trialSessionEntity.isCaseAlreadyCalendared({
      docketNumber: minuteSheet.docketNumber,
    });
  });

  // Get case info for each unscheduled minute sheet
  const unscheduledMinuteSheetInfoPromises = unscheduledMinuteSheets.map(
    async minuteSheet => {
      const caseDetails = await getCaseByDocketNumber({
        docketNumber: minuteSheet.docketNumber,
        includeConsolidatedCases: false,
      });

      if (!caseDetails) {
        // If case no longer exists, skip it
        return null;
      }

      return {
        caseCaption: caseDetails.caseCaption,
        docketNumber: caseDetails.docketNumber,
        docketNumberWithSuffix: Case.getDocketNumberWithSuffix({
          docketNumber: caseDetails.docketNumber,
          docketNumberSuffix: caseDetails.docketNumberSuffix,
        }),
      };
    },
  );

  const results = await Promise.all(unscheduledMinuteSheetInfoPromises);

  // Filter out nulls (cases that no longer exist)
  return results.filter(
    (result): result is UnscheduledMinuteSheetInfo => result !== null,
  );
};
