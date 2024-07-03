import { Contact } from './Contact';
import { JoiValidationConstants } from '../JoiValidationConstants';

export class PetitionerConservatorContact extends Contact {
  constructor(rawContact) {
    super(rawContact, 'PetitionerConservatorContact');
  }

  getValidationRules() {
    return {
      ...super.getValidationRules(),
      secondaryName: JoiValidationConstants.STRING.max(500)
        .required()
        .messages({ '*': 'Enter name of conservator' }),
    };
  }
}
