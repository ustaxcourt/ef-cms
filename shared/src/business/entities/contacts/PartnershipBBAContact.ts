import { Contact } from './Contact';
import { JoiValidationConstants } from '../JoiValidationConstants';

export class PartnershipBBAPrimaryContact extends Contact {
  constructor(
    rawContact,
    { applicationContext }: { applicationContext: IApplicationContext },
  ) {
    super(rawContact, 'PartnershipBBAPrimaryContact', {
      applicationContext,
    });
  }

  getValidationRules() {
    return {
      ...super.getValidationRules(),
      secondaryName: JoiValidationConstants.STRING.max(500)
        .required()
        .messages({ '*': 'Enter partnership representative name' }),
    };
  }
}
