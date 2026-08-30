import {
  SESSION_STATUS_TYPES,
  SESSION_TYPES,
  TRIAL_SESSION_PROCEEDING_TYPES,
  TRIAL_SESSION_SCOPE_TYPES,
  TrialSessionProceedingType,
} from '@shared/business/entities/EntityConstants';
import { JoiValidationConstants } from '@shared/business/entities/JoiValidationConstants';
import { JoiValidationEntity } from '@shared/business/entities/JoiValidationEntity';
import { RawTrialSession } from '../../entities/trialSessions/TrialSession';
import joi from 'joi';

export class PublicTrialSessionInfo extends JoiValidationEntity {
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
    super('PublicTrialSessionInfo');
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

  static VALIDATION_RULES = {
    isCalendared: joi.boolean().required(),
    judge: joi
      .object({ name: JoiValidationConstants.STRING.required() })
      .optional(),
    proceedingType: JoiValidationConstants.STRING.valid(
      ...Object.values(TRIAL_SESSION_PROCEEDING_TYPES),
    ).required(),
    sessionScope: JoiValidationConstants.STRING.valid(
      ...Object.values(TRIAL_SESSION_SCOPE_TYPES),
    ).required(),
    sessionStatus: JoiValidationConstants.STRING.valid(
      ...Object.values(SESSION_STATUS_TYPES),
    ).required(),
    sessionType: JoiValidationConstants.STRING.valid(
      ...Object.values(SESSION_TYPES),
    ).required(),
    startDate: JoiValidationConstants.ISO_DATE.required(),
    swingSession: joi.boolean().optional(),
    term: JoiValidationConstants.STRING.required(),
    termYear: JoiValidationConstants.STRING.required(),
    trialLocation: JoiValidationConstants.STRING.optional().allow('', null),
    trialSessionId: JoiValidationConstants.UUID.optional(),
  };

  getValidationRules() {
    return PublicTrialSessionInfo.VALIDATION_RULES;
  }
}
