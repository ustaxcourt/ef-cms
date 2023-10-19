import { Contact } from './Contact';
import { JoiValidationConstants } from '../JoiValidationConstants';
import { setDefaultErrorMessage } from '@shared/business/entities/utilities/setDefaultErrorMessage';

export class PetitionerGuardianContact extends Contact {
  constructor(
    rawContact,
    { applicationContext }: { applicationContext: IApplicationContext },
  ) {
    super(rawContact, 'PetitionerGuardianContact', {
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
        .messages(setDefaultErrorMessage('Enter name of guardian')),
    };
  }

  getErrorToMessageMap() {
    return {
      ...super.getErrorToMessageMap(),
      secondaryName: 'Enter name of guardian',
    };
  }
}
