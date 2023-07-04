import { ClosedTrialSession } from './ClosedTrialSession';
import {
  FORMATS,
  formatDateString,
  isTodayWithinGivenInterval,
  prepareDateFromString,
} from '../../utilities/DateHandler';
import { SESSION_STATUS_TYPES } from '../EntityConstants';
import { TrialSession } from './TrialSession';
import joi from 'joi';

export class OpenTrialSession extends TrialSession {
  public dismissedAlertForNOTT: boolean;
  public hasNOTTBeenServed: boolean;
  public isStartDateWithinNOTTReminderRange: boolean; //TODO: should be a computed property
  public thirtyDaysBeforeTrialFormatted: string; // TODO: should be a computed property

  constructor(rawProps) {
    super('OpenTrialSession');

    const formattedStartDate = formatDateString(this.startDate, FORMATS.MMDDYY);
    const trialStartDateString = prepareDateFromString(
      formattedStartDate,
      FORMATS.MMDDYY,
    );
    this.isStartDateWithinNOTTReminderRange = isTodayWithinGivenInterval({
      intervalEndDate: trialStartDateString.minus({
        ['days']: 28, // luxon's interval end date is not inclusive
      }),
      intervalStartDate: trialStartDateString.minus({
        ['days']: 34,
      }),
    });

    const thirtyDaysBeforeTrialInclusive = trialStartDateString.minus({
      ['days']: 29,
    });

    this.thirtyDaysBeforeTrialFormatted = formatDateString(
      thirtyDaysBeforeTrialInclusive,
      FORMATS.MMDDYY,
    );

    this.dismissedAlertForNOTT = rawProps.dismissedAlertForNOTT || false;
    this.hasNOTTBeenServed = rawProps.hasNOTTBeenServed || false;
    this.sessionStatus = SESSION_STATUS_TYPES.open;
  }

  static VALIDATION_RULES = {
    ...TrialSession.VALIDATION_RULES,
    dismissedAlertForNOTT: joi.boolean().required(),
    hasNOTTBeenServed: joi.boolean().required(),
  };

  getValidationRules() {
    return OpenTrialSession.VALIDATION_RULES;
  }

  setAsClosed(): ClosedTrialSession {
    this.sessionStatus = SESSION_STATUS_TYPES.closed;
    return new ClosedTrialSession(this);
  }

  setNoticesIssued() {
    this.noticeIssuedDate = createISODateString();
    return this;
  }
}

export type RawOpenTrialSession = ExcludeMethods<OpenTrialSession>;
