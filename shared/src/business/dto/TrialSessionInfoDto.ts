const { isEmpty, isEqual } = require('lodash');
const { TRIAL_SESSION_SCOPE_TYPES } = require('../entities/EntityConstants');

export const getTrialSessionStatus = ({ applicationContext, session }) => {
  const { SESSION_STATUS_GROUPS } = applicationContext.getConstants();

  const allCases = session.caseOrder || [];
  const inactiveCases = allCases.filter(
    sessionCase => sessionCase.removedFromTrial === true,
  );

  if (
    session.isClosed ||
    (!isEmpty(allCases) &&
      isEqual(allCases, inactiveCases) &&
      session.sessionScope !== TRIAL_SESSION_SCOPE_TYPES.standaloneRemote)
  ) {
    return SESSION_STATUS_GROUPS.closed;
  } else if (session.isCalendared) {
    return SESSION_STATUS_GROUPS.open;
  } else {
    return SESSION_STATUS_GROUPS.new;
  }
};

export class TrialSessionInfoDto {
  public estimatedEndDate: string;
  public isCalendared: boolean;
  public isClosed: boolean;
  public judge: {
    name: string;
    userId: string;
  };
  public proceedingType: string;
  public sessionType: string;
  public startDate: string;
  public startTime: string;
  public term: string;
  public termYear: string;
  public trialLocation: string;
  public trialSessionId: string;
  public noticeIssuedDate: string;
  public sessionScope: string;
  public sessionStatus: string;

  constructor(
    rawTrialSession: TTrialSessionData,
    applicationContext: IApplicationContext,
  ) {
    this.estimatedEndDate = rawTrialSession.estimatedEndDate;
    this.isCalendared = rawTrialSession.isCalendared;
    this.isClosed = rawTrialSession.isClosed;
    this.judge = rawTrialSession.judge;
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

    this.sessionStatus = getTrialSessionStatus({
      applicationContext,
      session: rawTrialSession,
    });
  }
}
