import { Contact } from './Contact';
import { JoiValidationConstants } from '../JoiValidationConstants';

export class PartnershipOtherThanTaxMattersPrimaryContact extends Contact {
  constructor(
    rawContact,
    { applicationContext }: { applicationContext: IApplicationContext },
  ) {
    super(rawContact, 'PartnershipOtherThanTaxMattersPrimaryContact', {
      applicationContext,
    });
  }

  getValidationRules() {
    return {
      ...super.getValidationRules(),
      secondaryName: JoiValidationConstants.STRING.max(500)
        .required()
        .messages({ '*': 'Enter name of partner' }),
    };
  }
}
