import { RawTrialSession } from '@shared/business/entities/trialSessions/TrialSession';
import { TRIAL_SESSION_PROCEEDING_TYPES } from '@shared/business/entities/EntityConstants';
import {
  formatDateString,
  FORMATS,
} from '@shared/business/utilities/DateHandler';

export function shouldGenerateNoticeOfChangeTrialStartDate(
  currentTrialSession: RawTrialSession,
  updatedTrialSession: RawTrialSession,
): boolean {
  if (!currentTrialSession.isCalendared || !updatedTrialSession.isCalendared)
    return false;

  // Reporting sessions have a due date, not a trial date, so no notice is issued when it changes
  if (
    currentTrialSession.proceedingType ===
      TRIAL_SESSION_PROCEEDING_TYPES.reporting ||
    updatedTrialSession.proceedingType ===
      TRIAL_SESSION_PROCEEDING_TYPES.reporting
  )
    return false;
  return (
    formatDateString(
      currentTrialSession.startDate,
      FORMATS.MONTH_DAY_YEAR_WITH_DAY_OF_WEEK,
    ) !==
    formatDateString(
      updatedTrialSession.startDate,
      FORMATS.MONTH_DAY_YEAR_WITH_DAY_OF_WEEK,
    )
  );
}
