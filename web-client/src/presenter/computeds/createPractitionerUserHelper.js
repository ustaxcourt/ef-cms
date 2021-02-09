import { state } from 'cerebral';

export const createPractitionerUserHelper = get => {
  const { barNumber, employer, originalEmail } = get(state.form);

  return {
    canEditAdmissionStatus: !!barNumber,
    canEditEmail: !barNumber,
    formattedOriginalEmail: originalEmail || 'Not provided',
    isAddingPractitioner: !barNumber,
    isEditingPractitioner: !!barNumber,
    showFirmName: employer === 'Private',
  };
};
