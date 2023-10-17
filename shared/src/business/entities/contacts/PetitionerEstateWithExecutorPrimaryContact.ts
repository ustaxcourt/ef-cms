import { Contact } from './Contact';
import { JoiValidationConstants } from '../JoiValidationConstants';
import { setDefaultErrorMessage } from '@shared/business/entities/utilities/setDefaultErrorMessage';

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
      secondaryName: JoiValidationConstants.STRING.max(500)
        .required()
        .messages(
          setDefaultErrorMessage(
            'Enter name of executor/personal representative',
          ),
        ),
      title: JoiValidationConstants.STRING.max(100)
        .optional()
        .messages(setDefaultErrorMessage('Enter title')),
    };
  }
}
