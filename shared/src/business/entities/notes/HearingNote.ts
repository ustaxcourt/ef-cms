import { JoiValidationConstants } from '../JoiValidationConstants';
import { JoiValidationEntity } from '../JoiValidationEntity';

export class HearingNote extends JoiValidationEntity {
  public note: string;

  constructor(rawProps) {
    super('HearingNote');

    this.note = rawProps.note;
  }

  static VALIDATION_RULES = {
    note: JoiValidationConstants.STRING.max(200).required().messages({
      '*': 'Add a note',
      'string.max': 'Limit is 200 characters. Enter 200 or fewer characters.',
    }),
  } as const;
  getValidationRules() {
    return HearingNote.VALIDATION_RULES;
  }
}

export type RawHearingNote = ExcludeMethods<HearingNote>;
