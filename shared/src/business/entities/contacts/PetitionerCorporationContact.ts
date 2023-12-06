import { Contact } from './Contact';

export class PetitionerCorporationContact extends Contact {
  constructor(
    rawContact,
    { applicationContext }: { applicationContext: IApplicationContext },
  ) {
    super(rawContact, 'PetitionerCorporationContact', {
      applicationContext,
    });
  }

  getValidationRules() {
    return super.getValidationRules();
  }
}
