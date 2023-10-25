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

  getValidationRules() {
    return CalendarNote.VALIDATION_RULES;
  }
}

export type RawCalendarNote = ExcludeMethods<CalendarNote>;
