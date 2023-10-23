import { Contact } from './Contact';

export class PetitionerPrimaryContact extends Contact {
  constructor(
    rawContact,
    { applicationContext }: { applicationContext: IApplicationContext },
  ) {
    super(rawContact, 'PetitionerPrimaryContact', {
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
