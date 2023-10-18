import { Contact } from './Contact';
import { JoiValidationConstants } from '../JoiValidationConstants';

export class PartnershipAsTaxMattersPartnerPrimaryContact extends Contact {
  constructor(
    rawContact,
    { applicationContext }: { applicationContext: IApplicationContext },
  ) {
    super(rawContact, 'PartnershipAsTaxMattersPartnerPrimaryContact', {
      applicationContext,
    });
  }

  getValidationRules() {
    return {
      ...super.getValidationRules(),
      secondaryName: JoiValidationConstants.STRING.max(500).required(),
    };
  }

  getValidationRules_NEW() {
    return {
      ...super.getValidationRules_NEW(),
      secondaryName: JoiValidationConstants.STRING.max(500).required(),
    };
  }

  getErrorToMessageMap() {
    return {
      ...super.getErrorToMessageMap(),
      econdaryName: 'Enter Tax Matters Partner name', // TODO: IS THIS A TYPO?
    };
  }
}
