import { Contact } from './Contact';
import { JoiValidationConstants } from '../JoiValidationConstants';

export class NextFriendForMinorContact extends Contact {
  constructor(rawContact) {
    super(rawContact, 'NextFriendForMinorContact');
  }

  getValidationRules() {
    return {
      ...super.getValidationRules(),
      secondaryName: JoiValidationConstants.STRING.max(500)
        .required()
        .messages({ '*': 'Enter name of next friend' }),
    };
  }
}
