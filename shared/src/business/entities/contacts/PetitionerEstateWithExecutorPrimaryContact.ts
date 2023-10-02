import { Contact } from './Contact';
import { JoiValidationConstants } from '../JoiValidationConstants';
import { setDefaultErrorMessages } from '@shared/business/entities/utilities/setDefaultErrorMessages';

export class PetitionerEstateWithExecutorPrimaryContact extends Contact {
  constructor(
    rawContact,
    { applicationContext }: { applicationContext: IApplicationContext },
  ) {
    super(rawContact, 'PetitionerEstateWithExecutorPrimaryContact', {
      applicationContext,
    });
  }

  getValidationRules() {
    return {
      ...super.getValidationRules(),
      secondaryName: JoiValidationConstants.STRING.max(500).required(),
      title: JoiValidationConstants.STRING.max(100).optional(),
    };
  }

  getValidationRules_NEW() {
    return {
      ...super.getValidationRules_NEW(),
      secondaryName: JoiValidationConstants.STRING.max(500)
        .required()
        .messages(
          setDefaultErrorMessages(
            'Enter name of executor/personal representative',
          ),
        ),
      title: JoiValidationConstants.STRING.max(100)
        .optional()
        .messages(setDefaultErrorMessages('Enter title')),
    };
  }

  getErrorToMessageMap() {
    return {
      ...super.getErrorToMessageMap(),
      secondaryName: 'Enter name of executor/personal representative',
      title: 'Enter title',
    };
  }
}
