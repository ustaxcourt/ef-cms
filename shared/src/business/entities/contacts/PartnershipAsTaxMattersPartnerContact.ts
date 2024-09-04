import { Contact } from './Contact';
import { JoiValidationConstants } from '../JoiValidationConstants';

export class PartnershipAsTaxMattersPartnerPrimaryContact extends Contact {
  constructor(rawContact) {
    super(rawContact, 'PartnershipAsTaxMattersPartnerPrimaryContact');
  }

  getValidationRules() {
    return {
      ...super.getValidationRules(),
      secondaryName: JoiValidationConstants.STRING.max(500)
        .required()
        .messages({ '*': 'Enter Tax Matters Partner name' }),
    };
  }
}
