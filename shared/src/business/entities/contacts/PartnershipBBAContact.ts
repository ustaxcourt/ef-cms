import { Contact } from './Contact';
import { JoiValidationConstants } from '../JoiValidationConstants';

export class PartnershipBBAPrimaryContact extends Contact {
  constructor(rawContact) {
    super(rawContact, 'PartnershipBBAPrimaryContact');
  }

  getValidationRules() {
    return {
      ...super.getValidationRules(),
      secondaryName: JoiValidationConstants.STRING.max(500)
        .required()
        .messages({ '*': 'Enter partnership representative name' }),
    };
  }
}
