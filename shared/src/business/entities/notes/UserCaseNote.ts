import { JoiValidationConstants } from '../JoiValidationConstants';
import { JoiValidationEntity } from '../JoiValidationEntity';

export class UserCaseNote extends JoiValidationEntity {
  public docketNumber: string;
  public userId: string;
  public notes: string;

  constructor(rawProps) {
    super('UserCaseNote');

    this.docketNumber = rawProps.docketNumber;
    this.userId = rawProps.userId;
    this.notes = rawProps.notes;
  }

  static VALIDATION_RULES = {
    docketNumber: JoiValidationConstants.DOCKET_NUMBER.required(),
    notes: JoiValidationConstants.STRING.required(),
    userId: JoiValidationConstants.UUID.required(),
  };

  static VALIDATION_ERROR_MESSAGES = {
    notes: 'Add note',
  };

  getValidationRules() {
    return UserCaseNote.VALIDATION_RULES;
  }

  getErrorToMessageMap() {
    return UserCaseNote.VALIDATION_ERROR_MESSAGES;
  }
}

export type RawUserCaseNote = ExcludeMethods<UserCaseNote>;
