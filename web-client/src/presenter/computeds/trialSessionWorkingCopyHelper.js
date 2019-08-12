import { state } from 'cerebral';

export const trialSessionWorkingCopyHelper = get => {
  const trialSession = get(state.trialSession) || {};
  return {
    title: trialSession.title || 'Birmingham, Alabama',
  };
};
