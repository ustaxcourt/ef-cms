import { state } from 'cerebral';

export const headerHelper = get => {
  const user = get(state.user);

  return {
    showSearchInHeader: user && user.role && user.role !== 'practitioner',
  };
};
