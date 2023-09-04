import { JoiValidationConstants } from '../JoiValidationConstants';
import { JoiValidationEntity } from '../JoiValidationEntity';

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

  getErrorToMessageMap() {
    return Note.VALIDATION_ERROR_MESSAGES;
  }
}

declare global {
  type RawNote = ExcludeMethods<Note>;
}
