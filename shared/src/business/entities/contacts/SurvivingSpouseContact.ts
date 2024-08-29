import { Contact } from './Contact';
import { JoiValidationConstants } from '../JoiValidationConstants';

export class SurvivingSpouseContact extends Contact {
  constructor(rawContact) {
    super(rawContact, 'SurvivingSpouseContact');
  }

  getValidationRules() {
    return {
      ...super.getValidationRules(),
      secondaryName: JoiValidationConstants.STRING.max(500)
        .required()
        .messages({ '*': 'Enter name of surviving spouse' }),
    };
  }
}
