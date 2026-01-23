import { Case, isLeadCase } from '@shared/business/entities/cases/Case';
import {
  InvalidRequest,
  NotFoundError,
  UnauthorizedError,
} from '@web-api/errors/errors';
import {
  ROLE_PERMISSIONS,
  isAuthorized,
} from '@shared/authorization/authorizationClientService';
import { TrialSession } from '@shared/business/entities/trialSessions/TrialSession';
import { UnknownAuthUser } from '@shared/business/entities/authUser/AuthUser';
import { getCaseByDocketNumber } from '@web-api/persistence/postgres/cases/getCaseByDocketNumber';
import { getConsolidatedCases } from '@web-api/persistence/postgres/cases/getConsolidatedCases';
import { getTrialSessionById } from '@web-api/persistence/postgres/trialSessions/getTrialSessionById';

export type ValidateCaseForNewMinuteSheetResult = {
  docketNumber: string;
  docketNumberWithSuffix: string;
  caseCaption: string;
  leadDocketNumber?: string;
  isLeadCase: boolean;
  consolidatedCases: {
    docketNumber: string;
    docketNumberWithSuffix: string;
    caseCaption: string;
  }[];
};

/**
 * Validates a case for creating a new minute sheet for an unscheduled case.
 * This allows trial clerks to create minute sheets for cases heard ad hoc
 * at a trial session without formally adding them to the session.
 *
 * @param {object} params the params object
 * @param {string} params.docketNumber the docket number of the case to validate
 * @param {string} params.trialSessionId the id of the trial session
 * @param {object} authorizedUser the user making the request
 * @returns {Promise<ValidateCaseForNewMinuteSheetResult>} the case info if valid
 */
export const validateCaseForNewMinuteSheetInteractor = async (
  { docketNumber, trialSessionId },
  authorizedUser: UnknownAuthUser,
): Promise<ValidateCaseForNewMinuteSheetResult> => {
  if (!isAuthorized(authorizedUser, ROLE_PERMISSIONS.MANAGE_MINUTE_SHEET)) {
    throw new UnauthorizedError('Unauthorized');
  }

  const formattedDocketNumber = Case.formatDocketNumber(docketNumber);

  const caseDetails = await getCaseByDocketNumber({
    docketNumber: formattedDocketNumber,
    includeConsolidatedCases: false,
  });

  if (!caseDetails) {
    throw new NotFoundError(`Case ${formattedDocketNumber} was not found.`);
  }

  const trialSession = await getTrialSessionById({
    trialSessionId,
  });

  if (!trialSession) {
    throw new NotFoundError(`Trial session ${trialSessionId} was not found.`);
  }

  const caseEntity = new Case(caseDetails, { authorizedUser });
  const trialSessionEntity = new TrialSession(trialSession);

  const isCaseCalendared =
    trialSessionEntity.isCaseAlreadyCalendared(caseEntity);

  if (isCaseCalendared) {
    throw new InvalidRequest(
      `Case ${formattedDocketNumber} is already associated with this trial session.`,
    );
  }

  let consolidatedCases: {
    docketNumber: string;
    docketNumberWithSuffix: string;
    caseCaption: string;
  }[] = [];

  if (caseDetails.leadDocketNumber) {
    const allConsolidatedCases = await getConsolidatedCases({
      excludeFields: ['correspondence', 'docketEntries', 'hearings'],
      leadDocketNumber: caseDetails.leadDocketNumber,
    });

    consolidatedCases = allConsolidatedCases.map(c => ({
      caseCaption: c.caseCaption,
      docketNumber: c.docketNumber,
      docketNumberWithSuffix: Case.getDocketNumberWithSuffix({
        docketNumber: c.docketNumber,
        docketNumberSuffix: c.docketNumberSuffix,
      }),
    }));
  }

  return {
    caseCaption: caseEntity.caseCaption,
    consolidatedCases,
    docketNumber: caseEntity.docketNumber,
    docketNumberWithSuffix: caseEntity.docketNumberWithSuffix,
    isLeadCase: isLeadCase(caseDetails),
    leadDocketNumber: caseDetails.leadDocketNumber,
  };
};
