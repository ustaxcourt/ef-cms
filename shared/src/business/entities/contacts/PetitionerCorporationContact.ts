import { Contact } from './Contact';

export class PetitionerCorporationContact extends Contact {
  constructor(rawContact) {
    super(rawContact, 'PetitionerCorporationContact');
  }

  getValidationRules() {
    return super.getValidationRules();
  }
}
