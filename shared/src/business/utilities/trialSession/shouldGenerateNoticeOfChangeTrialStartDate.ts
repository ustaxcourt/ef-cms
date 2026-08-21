import { RawTrialSession } from '@shared/business/entities/trialSessions/TrialSession';
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
