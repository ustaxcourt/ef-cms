import { Contact } from './Contact';
import { JoiValidationConstants } from '../JoiValidationConstants';

export class PetitionerCustodianContact extends Contact {
  constructor(rawContact) {
    super(rawContact, 'PetitionerCustodianContact');
  }

  getValidationRules() {
    return {
      ...super.getValidationRules(),
      secondaryName: JoiValidationConstants.STRING.max(500)
        .required()
        .messages({ '*': 'Enter name of custodian' }),
    };
  }
}
