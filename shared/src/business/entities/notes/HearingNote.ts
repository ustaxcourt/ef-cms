import { JoiValidationConstants } from '../JoiValidationConstants';
import { JoiValidationEntity } from '../JoiValidationEntity';
import { setDefaultErrorMessages } from '@shared/business/entities/utilities/setDefaultErrorMessages';

export class HearingNote extends JoiValidationEntity {
  public note: string;

  constructor(rawProps) {
    super('HearingNote');

    this.note = rawProps.note;
  }

  static VALIDATION_RULES = {
    note: JoiValidationConstants.STRING.max(200).required(),
  } as const;

  static VALIDATION_ERROR_MESSAGES = {
    note: [
      {
        contains: 'length must be less than or equal',
        message: 'Limit is 200 characters. Enter 200 or fewer characters.',
      },
      'Add a note',
    ],
  } as const;

  getValidationRules() {
    return HearingNote.VALIDATION_RULES;
  }

  static VALIDATION_RULES_NEW = {
    note: JoiValidationConstants.STRING.max(200)
      .required()
      .messages({
        ...setDefaultErrorMessages('Add a note'),
        'string.max': 'Limit is 200 characters. Enter 200 or fewer characters.',
      }),
  } as const;

  getValidationRules_NEW() {
    return HearingNote.VALIDATION_RULES_NEW;
  }

  getErrorToMessageMap() {
    return HearingNote.VALIDATION_ERROR_MESSAGES;
  }
}

export type RawHearingNote = ExcludeMethods<HearingNote>;
