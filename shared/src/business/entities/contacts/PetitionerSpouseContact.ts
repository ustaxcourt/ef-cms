import { Contact } from './Contact';

export class PetitionerSpouseContact extends Contact {
  constructor(rawContact) {
    super(rawContact, 'PetitionerSpouseContact');
  }

  getValidationRules() {
    return super.getValidationRules();
  }
}
