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

  getValidationRules_NEW() {
    return super.getValidationRules_NEW();
  }

  getErrorToMessageMap() {
    return super.getErrorToMessageMap();
  }
}
