import {
  RawTrialSession,
  TJudge,
} from '../../entities/trialSessions/TrialSession';
import { TrialSessionProceedingType } from '@shared/business/entities/EntityConstants';

export class TrialSessionInfoDTO {
  public estimatedEndDate?: string;
  public isCalendared: boolean;
  public judge?: TJudge;
  public proceedingType: TrialSessionProceedingType;
  public sessionType: string;
  public startDate: string;
  public startTime?: string;
  public term: string;
  public termYear: string;
  public trialLocation?: string;
  public trialSessionId?: string;
  public noticeIssuedDate?: string;
  public sessionScope: string;
  public sessionStatus: string;
  public swingSession?: boolean;
  public dismissedAlertForNOTT?: boolean;
  public isStartDateWithinNOTTReminderRange?: boolean;
  public thirtyDaysBeforeTrialFormatted?: string;

  constructor(rawTrialSession: RawTrialSession) {
    this.estimatedEndDate = rawTrialSession.estimatedEndDate;
    this.isCalendared = rawTrialSession.isCalendared;
    this.judge = rawTrialSession.judge;
    this.isStartDateWithinNOTTReminderRange =
      rawTrialSession.isStartDateWithinNOTTReminderRange;
    this.thirtyDaysBeforeTrialFormatted =
      rawTrialSession.thirtyDaysBeforeTrialFormatted;
    this.proceedingType = rawTrialSession.proceedingType;
    this.sessionType = rawTrialSession.sessionType;
    this.startDate = rawTrialSession.startDate;
    this.startTime = rawTrialSession.startTime;
    this.term = rawTrialSession.term;
    this.sessionScope = rawTrialSession.sessionScope;
    this.termYear = rawTrialSession.termYear;
    this.trialLocation = rawTrialSession.trialLocation;
    this.trialSessionId = rawTrialSession.trialSessionId;
    this.noticeIssuedDate = rawTrialSession.noticeIssuedDate;
    this.sessionStatus = rawTrialSession.sessionStatus;
    this.swingSession = rawTrialSession.swingSession;
    this.dismissedAlertForNOTT = rawTrialSession.dismissedAlertForNOTT;
  }
}
