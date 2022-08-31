import { state } from 'cerebral';

export const sessionAssignmentHelper = get => {
  let formattedTrialClerks = get(state.trialClerks);
  formattedTrialClerks = [
    { name: 'Other*', userId: 'Other' },
    ...formattedTrialClerks,
  ];

  let showAlternateTrialClerkField =
    get(state.form.trialClerk.userId) === 'Other';

  return { formattedTrialClerks, showAlternateTrialClerkField };
};
