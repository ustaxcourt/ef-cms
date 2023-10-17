import { JoiValidationConstants } from '../JoiValidationConstants';
import { JoiValidationEntity } from '../JoiValidationEntity';
import { setDefaultErrorMessage } from '@shared/business/entities/utilities/setDefaultErrorMessage';

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
    notes: JoiValidationConstants.STRING.required().messages(
      setDefaultErrorMessage('Add note'),
    ),
    userId: JoiValidationConstants.UUID.required(),
  };

  getValidationRules() {
    return UserCaseNote.VALIDATION_RULES;
  }
}

export type RawUserCaseNote = ExcludeMethods<UserCaseNote>;
