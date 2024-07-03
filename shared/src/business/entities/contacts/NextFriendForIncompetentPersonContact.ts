import { Contact } from './Contact';
import { JoiValidationConstants } from '../JoiValidationConstants';

export class NextFriendForIncompetentPersonContact extends Contact {
  constructor(rawContact) {
    super(rawContact, 'NextFriendForIncompetentPersonContact');
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
