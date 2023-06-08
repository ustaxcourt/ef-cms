import { JoiValidationConstants } from '../JoiValidationConstants';
import { JoiValidationEntity } from '../JoiValidationEntity';

export class CalendarNote extends JoiValidationEntity {
  public note?: string;

  constructor(rawProps) {
    super('CalendarNote');

    this.note = rawProps.note?.trim();
  }

  static VALIDATION_RULES = {
    note: JoiValidationConstants.STRING.max(200).allow('', null).optional(),
  };

  static VALIDATION_ERROR_MESSAGES = {
    note: 'Limit is 200 characters. Enter 200 or fewer characters.',
  };

  getValidationRules() {
    return CalendarNote.VALIDATION_RULES;
  }

  getErrorToMessageMap() {
    return CalendarNote.VALIDATION_ERROR_MESSAGES;
  }
}

export type RawCalendarNote = ExcludeMethods<CalendarNote>;
