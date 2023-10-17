import { Contact } from './Contact';
import { JoiValidationConstants } from '../JoiValidationConstants';
import { setDefaultErrorMessage } from '@shared/business/entities/utilities/setDefaultErrorMessage';

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
      inCareOf: JoiValidationConstants.STRING.max(100)
        .required()
        .messages(setDefaultErrorMessage('Enter name for in care of')),
      phone: JoiValidationConstants.STRING.max(100).optional().allow(null),
    };
  }
}
