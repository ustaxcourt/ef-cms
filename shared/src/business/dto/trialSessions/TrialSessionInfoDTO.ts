import {
  RawTrialSession,
  TJudge,
  TTrialClerk,
} from '../../entities/trialSessions/TrialSession';
import { TrialSessionProceedingType } from '@shared/business/entities/EntityConstants';

export class TrialSessionInfoDTO {
  public alternateTrialClerkName?: string;
  public dismissedAlertForNott?: boolean;
  public estimatedEndDate?: string;
  public isCalendared: boolean;
  public judge?: TJudge;
  public noticeIssuedDate?: string;
  public proceedingType: TrialSessionProceedingType;
  public sessionScope: string;
  public sessionStatus: string;
  public sessionType: string;
  public startDate: string;
  public startTime?: string;
  public swingSession?: boolean;
  public term: string;
  public termYear: string;
  public trialClerk?: TTrialClerk;
  public trialLocation?: string;
  public trialSessionId?: string;

  constructor(rawTrialSession: RawTrialSession) {
    this.alternateTrialClerkName = rawTrialSession.alternateTrialClerkName;
    this.dismissedAlertForNott = rawTrialSession.dismissedAlertForNott;
    this.estimatedEndDate = rawTrialSession.estimatedEndDate;
    this.isCalendared = rawTrialSession.isCalendared;
    this.judge = rawTrialSession.judge;
    this.noticeIssuedDate = rawTrialSession.noticeIssuedDate;
    this.proceedingType = rawTrialSession.proceedingType;
    this.sessionScope = rawTrialSession.sessionScope;
    this.sessionStatus = rawTrialSession.sessionStatus;
    this.sessionType = rawTrialSession.sessionType;
    this.startDate = rawTrialSession.startDate;
    this.startTime = rawTrialSession.startTime;
    this.swingSession = rawTrialSession.swingSession;
    this.term = rawTrialSession.term;
    this.termYear = rawTrialSession.termYear;
    this.trialClerk = rawTrialSession.trialClerk;
    this.trialLocation = rawTrialSession.trialLocation;
    this.trialSessionId = rawTrialSession.trialSessionId;
  }
}
