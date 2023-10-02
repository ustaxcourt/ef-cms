import { Contact } from './Contact';
import { JoiValidationConstants } from '../JoiValidationConstants';
import { setDefaultErrorMessages } from '@shared/business/entities/utilities/setDefaultErrorMessages';

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

  getValidationRules_NEW() {
    return {
      ...super.getValidationRules_NEW(),
      inCareOf: JoiValidationConstants.STRING.max(100)
        .required()
        .messages(setDefaultErrorMessages('Enter name for in care of')),
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
