import { JoiValidationConstants } from '../JoiValidationConstants';
import { JoiValidationEntity } from '../JoiValidationEntity';
import { setDefaultErrorMessage } from '@shared/business/entities/utilities/setDefaultErrorMessage';

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

  static VALIDATION_RULES_NEW = {
    note: JoiValidationConstants.STRING.max(200)
      .allow('', null)
      .optional()
      .messages(
        setDefaultErrorMessage(
          'Limit is 200 characters. Enter 200 or fewer characters.',
        ),
      ),
  };

  getValidationRules_NEW() {
    return CalendarNote.VALIDATION_RULES_NEW;
  }

  getErrorToMessageMap() {
    return CalendarNote.VALIDATION_ERROR_MESSAGES;
  }
}

export type RawCalendarNote = ExcludeMethods<CalendarNote>;
