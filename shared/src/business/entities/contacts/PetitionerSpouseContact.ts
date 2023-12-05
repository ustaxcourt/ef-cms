import { Contact } from './Contact';

export class PetitionerSpouseContact extends Contact {
  constructor(
    rawContact,
    { applicationContext }: { applicationContext: IApplicationContext },
  ) {
    super(rawContact, 'PetitionerSpouseContact', {
      applicationContext,
    });
  }

  getValidationRules() {
    return super.getValidationRules();
  }
}
