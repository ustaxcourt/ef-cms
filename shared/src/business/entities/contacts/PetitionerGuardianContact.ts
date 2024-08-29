import { Contact } from './Contact';
import { JoiValidationConstants } from '../JoiValidationConstants';

export class PetitionerGuardianContact extends Contact {
  constructor(rawContact) {
    super(rawContact, 'PetitionerGuardianContact');
  }

  getValidationRules() {
    return {
      ...super.getValidationRules(),
      secondaryName: JoiValidationConstants.STRING.max(500)
        .required()
        .messages({
          '*': 'Enter name of guardian',
        }),
    };
  }
}
