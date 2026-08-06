import { RawTrialSession } from '../../entities/trialSessions/TrialSession';
import { TrialSessionProceedingType } from '@shared/business/entities/EntityConstants';

export class PublicTrialSessionInfoDTO {
  public entityName: string;
  public isCalendared: boolean;
  public judge?: {
    name: string;
  };
  public proceedingType: TrialSessionProceedingType;
  public sessionScope: string;
  public sessionStatus: string;
  public sessionType: string;
  public startDate: string;
  public swingSession?: boolean;
  public term: string;
  public termYear: string;
  public trialLocation?: string;
  public trialSessionId?: string;

  constructor(rawTrialSession: RawTrialSession) {
    this.entityName = 'PublicTrialSessionInfoDTO';
    this.isCalendared = rawTrialSession.isCalendared;
    this.judge = rawTrialSession.judge
      ? { name: rawTrialSession.judge.name }
      : undefined;
    this.proceedingType = rawTrialSession.proceedingType;
    this.sessionScope = rawTrialSession.sessionScope;
    this.sessionStatus = rawTrialSession.sessionStatus;
    this.sessionType = rawTrialSession.sessionType;
    this.startDate = rawTrialSession.startDate;
    this.swingSession = rawTrialSession.swingSession;
    this.term = rawTrialSession.term;
    this.termYear = rawTrialSession.termYear;
    this.trialLocation = rawTrialSession.trialLocation;
    this.trialSessionId = rawTrialSession.trialSessionId;
  }
}
