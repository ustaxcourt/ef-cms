import { Get } from 'cerebral';
import { UpdateUserEmailForm } from '@shared/business/entities/UpdateUserEmailForm';
import { state } from '@web-client/presenter/app.cerebral';

export const createPractitionerUserHelper = (get: Get): any => {
  const form = get(state.form);
  const {
    barNumber,
    confirmEmail,
    email: emailFieldValue = form.updatedEmail,
    originalEmail,
    practiceType,
  } = form;
  const formEntity = new UpdateUserEmailForm({
    confirmEmail,
    email: emailFieldValue,
  });
  const errors = formEntity.getFormattedValidationErrors();

  return {
    canEditAdmissionStatus: !!barNumber,
    canEditEmail: !barNumber,
    confirmEmailErrorMessage: errors?.confirmEmail as string,
    emailErrorMessage: errors?.email as string,
    formattedOriginalEmail: originalEmail || 'Not provided',
    isAddingPractitioner: !barNumber,
    isEditingPractitioner: !!barNumber,
    showFirmName: practiceType === 'Private',
  };
};
