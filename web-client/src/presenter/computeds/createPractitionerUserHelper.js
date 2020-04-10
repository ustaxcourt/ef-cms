import { state } from 'cerebral';

export const createPractitionerUserHelper = get => {
  const { employer } = get(state.form);

  return {
    showFirmName: employer === 'Private',
  };
};
