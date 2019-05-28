import { state } from 'cerebral';

export const scanHelper = get => {
  const user = get(state.user);
  let hasScanFeature = false;

  if (user && user.role) {
    const internalRoles = ['petitionsclerk', 'docketclerk', 'seniorattorney'];
    if (user && user.role && internalRoles.includes(user.role)) {
      hasScanFeature = true;
    }
  }

  return {
    hasScanFeature,
  };
};
