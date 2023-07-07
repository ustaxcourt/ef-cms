import { JoiValidationConstants } from '../JoiValidationConstants';
import { OpenTrialSession } from './OpenTrialSession';
import { SESSION_STATUS_TYPES } from '../EntityConstants';
import { TrialSession } from './TrialSession';
import joi from 'joi';

export class NewTrialSession extends TrialSession {
  public trialClerkId?: string;

  constructor(rawSession: RawNewTrialSession, { applicationContext }) {
    super(rawSession, 'NewTrialSession');

    if (!applicationContext) {
      throw new TypeError('applicationContext must be defined');
    }

    this.trialClerkId = rawSession.trialClerkId;
    this.trialSessionId =
      rawSession.trialSessionId || applicationContext.getUniqueId();
    this.sessionStatus = SESSION_STATUS_TYPES.new;
  }

  getErrorToMessageMap() {
    return {
      ...super.getErrorToMessageMap(),
      alternateTrialClerkName:
        'A valid alternate trial clerk name must be provided if "Other" is selected',
    };
  }

  getValidationRules() {
    return {
      ...TrialSession.VALIDATION_RULES,
      alternateTrialClerkName: joi.when('trialClerkId', {
        is: 'Other',
        otherwise: joi.optional(),
        then: JoiValidationConstants.STRING.max(100).required(),
      }),
      startDate: JoiValidationConstants.ISO_DATE.min('now').required(),
    };
  }

  setAsCalendared(): OpenTrialSession {
    this.isCalendared = true;
    this.sessionStatus = SESSION_STATUS_TYPES.open;
    return new OpenTrialSession(this);
  }
}

export type RawNewTrialSession = ExcludeMethods<NewTrialSession>;
