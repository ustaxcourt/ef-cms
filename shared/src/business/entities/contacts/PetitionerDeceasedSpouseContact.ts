import { Contact } from './Contact';
import { JoiValidationConstants } from '../JoiValidationConstants';

export class PetitionerDeceasedSpouseContact extends Contact {
  constructor(rawContact) {
    super(rawContact, 'PetitionerDeceasedSpouseContact');
  }

  getValidationRules() {
    return {
      ...super.getValidationRules(),
      inCareOf: JoiValidationConstants.STRING.max(100)
        .required()
        .messages({ '*': 'Enter name for in care of' }),
      phone: JoiValidationConstants.STRING.max(100).optional().allow(null),
    };
  }
}
