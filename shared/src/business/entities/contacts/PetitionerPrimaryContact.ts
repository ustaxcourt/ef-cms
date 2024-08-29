import { Contact } from './Contact';

export class PetitionerPrimaryContact extends Contact {
  constructor(rawContact) {
    super(rawContact, 'PetitionerPrimaryContact');
  }

  getValidationRules() {
    return super.getValidationRules();
  }
}
