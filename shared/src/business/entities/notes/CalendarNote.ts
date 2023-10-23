import { JoiValidationConstants } from '../JoiValidationConstants';
import { JoiValidationEntity } from '../JoiValidationEntity';

export class CalendarNote extends JoiValidationEntity {
  public note?: string;

  constructor(rawProps) {
    super('CalendarNote');

    this.note = rawProps.note?.trim();
  }

  static VALIDATION_RULES = {
    note: JoiValidationConstants.STRING.allow('', null).optional(),
  };

  static VALIDATION_ERROR_MESSAGES = {};

  getValidationRules() {
    return CalendarNote.VALIDATION_RULES;
  }

  getErrorToMessageMap() {
    return CalendarNote.VALIDATION_ERROR_MESSAGES;
  }
}

export type RawCalendarNote = ExcludeMethods<CalendarNote>;
