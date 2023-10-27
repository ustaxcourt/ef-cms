import { JoiValidationConstants } from '../JoiValidationConstants';
import { JoiValidationEntity } from '../JoiValidationEntity';
import { setDefaultErrorMessage } from '@shared/business/entities/utilities/setDefaultErrorMessage';

export class Note extends JoiValidationEntity {
  public notes: string;

  constructor(rawNote: { notes: string }) {
    super('Note');
    this.notes = rawNote.notes?.trim();
  }

  static VALIDATION_ERROR_MESSAGES = {
    notes: 'Add note',
  };

  static VALIDATION_RULES = {
    notes: JoiValidationConstants.STRING.required(),
  };

  getValidationRules() {
    return Note.VALIDATION_RULES;
  }

  static VALIDATION_RULES_NEW = {
    notes: JoiValidationConstants.STRING.required().messages(
      setDefaultErrorMessage('Add note'),
    ),
  };

  getValidationRules_NEW() {
    return Note.VALIDATION_RULES_NEW;
  }

  getErrorToMessageMap() {
    return Note.VALIDATION_ERROR_MESSAGES;
  }
}

declare global {
  type RawNote = ExcludeMethods<Note>;
}
