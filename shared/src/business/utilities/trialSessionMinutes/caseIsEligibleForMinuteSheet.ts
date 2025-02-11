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
  let isInConsolidatedGroup = false;
  let isCaseLeadCase = false;
  if (aCase.leadDocketNumber) {
    isCaseLeadCase = isLeadCase(aCase);
    isInConsolidatedGroup = true;
  }

  if (
    trialSession.isCalendared &&
    !isClosed(aCase) &&
    (isCaseLeadCase || !isInConsolidatedGroup)
  ) {
    if (trialSession.startTime) {
      const trialSessionStartDateTime = combineISOandEasternTime(
        trialSession.startDate,
        trialSession.startTime,
      );

      const caseWasRemovedFromTrialBeforeTrialStartDate =
        !!aCase.removedFromTrialDate &&
        dateStringsCompared(
          trialSessionStartDateTime,
          aCase.removedFromTrialDate,
        ) > 0;

      if (caseWasRemovedFromTrialBeforeTrialStartDate) {
        return false;
      }
    }

    return true;
  }

  return false;
};
