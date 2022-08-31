import { state } from 'cerebral';

export const sessionAssignmentHelper = get => {
  let formattedTrialClerks = get(state.trialClerks);
  formattedTrialClerks = [
    { name: 'Other*', userId: 'Other' },
    ...formattedTrialClerks,
  ];
  let showAlternateTrialClerkField = true;
  return { formattedTrialClerks, showAlternateTrialClerkField };
};
