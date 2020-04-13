import { state } from 'cerebral';

export const createPractitionerUserHelper = get => {
  const { barNumber, employer } = get(state.form);

  return {
    canEditEmail: !barNumber,
    showFirmName: employer === 'Private',
  };
};
