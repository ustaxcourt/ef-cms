import { Contact } from './Contact';
import { JoiValidationConstants } from '../JoiValidationConstants';
import { setDefaultErrorMessages } from '@shared/business/entities/utilities/setDefaultErrorMessages';

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
      secondaryName: JoiValidationConstants.STRING.max(500).required(),
    };
  }

  getValidationRules_NEW() {
    return {
      ...super.getValidationRules_NEW(),
      secondaryName: JoiValidationConstants.STRING.max(500)
        .required()
        .messages(
          setDefaultErrorMessages('Enter partnership representative name'),
        ),
    };
  }

  getErrorToMessageMap() {
    return {
      ...super.getErrorToMessageMap(),
      secondaryName: 'Enter partnership representative name',
    };
  }
}
