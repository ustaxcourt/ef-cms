import { JoiValidationConstants } from '../JoiValidationConstants';
import { JoiValidationEntity_New } from '@shared/business/entities/joiValidationEntity/JoiValidationEntity_New';

export class CalendarNote extends JoiValidationEntity_New {
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
