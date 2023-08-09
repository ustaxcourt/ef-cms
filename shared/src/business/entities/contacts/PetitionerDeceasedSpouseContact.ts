import { Contact } from './Contact';
import { JoiValidationConstants } from '../JoiValidationConstants';

export class PetitionerDeceasedSpouseContact extends Contact {
  constructor(
    rawContact,
    { applicationContext }: { applicationContext: IApplicationContext },
  ) {
    super(rawContact, 'PetitionerDeceasedSpouseContact', {
      applicationContext,
    });
  }

  getValidationRules() {
    return {
      ...super.getValidationRules(),
      inCareOf: JoiValidationConstants.STRING.max(100).required(),
      phone: JoiValidationConstants.STRING.max(100).optional().allow(null),
    };
  }

  getErrorToMessageMap() {
    return {
      ...super.getErrorToMessageMap(),
      inCareOf: 'Enter name for in care of',
    };
  }
}
