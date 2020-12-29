import { state } from 'cerebral';

export const createPractitionerUserHelper = get => {
  const { barNumber, email, employer } = get(state.form);

  return {
    canEditAdmissionStatus: !!barNumber,
    canEditEmail: !barNumber,
    emailFormatted: email || 'Not provided',
    showFirmName: employer === 'Private',
  };
};
