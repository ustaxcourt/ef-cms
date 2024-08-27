import { Contact } from './Contact';
import { JoiValidationConstants } from '../JoiValidationConstants';

export class PetitionerIntermediaryContact extends Contact {
  constructor(rawContact) {
    super(rawContact, 'PetitionerIntermediaryContact');
  }

  getValidationRules() {
    return {
      ...super.getValidationRules(),
      inCareOf: JoiValidationConstants.STRING.max(100)
        .optional()
        .messages({ '*': 'In care of has errors.' }),
    };
  }
}
