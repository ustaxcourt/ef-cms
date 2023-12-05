import { Contact } from './Contact';
import { JoiValidationConstants } from '../JoiValidationConstants';

export class SurvivingSpouseContact extends Contact {
  constructor(
    rawContact,
    { applicationContext }: { applicationContext: IApplicationContext },
  ) {
    super(rawContact, 'SurvivingSpouseContact', {
      applicationContext,
    });
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
