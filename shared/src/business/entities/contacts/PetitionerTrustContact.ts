import { Contact } from './Contact';
import { JoiValidationConstants } from '../JoiValidationConstants';

export class PetitionerTrustContact extends Contact {
  constructor(rawContact) {
    super(rawContact, 'PetitionerTrustContact');
  }

  getValidationRules() {
    return {
      ...super.getValidationRules(),
      secondaryName: JoiValidationConstants.STRING.max(500)
        .required()
        .messages({ '*': 'Enter name of trustee' }),
    };
  }
}
