import { Contact } from './Contact';
import { JoiValidationConstants } from '../JoiValidationConstants';

export class PetitionerEstateWithExecutorPrimaryContact extends Contact {
  constructor(rawContact) {
    super(rawContact, 'PetitionerEstateWithExecutorPrimaryContact');
  }

  getValidationRules() {
    return {
      ...super.getValidationRules(),
      secondaryName: JoiValidationConstants.STRING.max(500)
        .required()
        .messages({ '*': 'Enter name of executor/personal representative' }),
      title: JoiValidationConstants.STRING.max(100)
        .optional()
        .messages({ '*': 'Enter title' }),
    };
  }
}
