import { isClosed, isLeadCase } from '@shared/business/entities/cases/Case';
import {
  RawTrialSession,
  TCaseOrder,
} from '@shared/business/entities/trialSessions/TrialSession';
import {
  combineISOandEasternTime,
  dateStringsCompared,
} from '@shared/business/utilities/DateHandler';

export const caseIsEligibleForMinuteSheet = (
  aCase: RawCase & TCaseOrder,
  trialSession: RawTrialSession,
): boolean => {
  if (!trialSession.isCalendared) {
    return false;
  }

  if (isClosed(aCase)) {
    return false;
  }

  if (!isEligibleConsolidatedCase(aCase)) {
    return false;
  }

  if (wasRemovedBeforeTrialStart(aCase, trialSession)) {
    return false;
  }

  return true;
};

/**
 * Checks if an unscheduled case (not in trial session's caseOrder) is eligible
 * for a minute sheet. This is used when creating minute sheets for cases that
 * are NOT calendared on the trial session.
 */
export const isEligibleUnscheduledCaseForMinuteSheet = (
  aCase: RawCase,
  trialSession: RawTrialSession,
): boolean => {
  // Trial session must be calendared
  if (!trialSession.isCalendared) {
    return false;
  }

  // Case cannot be closed
  if (isClosed(aCase)) {
    return false;
  }

  // For consolidated cases, only the lead case is eligible
  if (!isEligibleConsolidatedCase(aCase as RawCase & TCaseOrder)) {
    return false;
  }

  return true;
};

const isEligibleConsolidatedCase = (aCase: RawCase & TCaseOrder): boolean => {
  if (!aCase.leadDocketNumber) {
    return true;
  }
  return isLeadCase(aCase);
};

const wasRemovedBeforeTrialStart = (
  aCase: RawCase & TCaseOrder,
  trialSession: RawTrialSession,
): boolean => {
  if (!trialSession.startTime || !aCase.removedFromTrialDate) {
    return false;
  }

  const trialSessionStartDateTime = combineISOandEasternTime(
    trialSession.startDate,
    trialSession.startTime,
  );

  return (
    dateStringsCompared(trialSessionStartDateTime, aCase.removedFromTrialDate) >
    0
  );
};
