import { state } from 'cerebral';

export const createPractitionerUserHelper = get => {
  const { barNumber, employer } = get(state.form);

  return {
    canEditAdmissionStatus: !!barNumber,
    canEditEmail: !barNumber,
    showFirmName: employer === 'Private',
  };
};
