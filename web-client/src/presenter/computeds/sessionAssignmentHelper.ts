import { state } from '@web-client/presenter/app.cerebral';

export const sessionAssignmentHelper = get => {
  let formattedTrialClerks = get(state.trialClerks);
  formattedTrialClerks = [
    { name: 'Other', userId: 'Other' },
    ...formattedTrialClerks,
  ];

  let showAlternateTrialClerkField = get(state.form.trialClerkId) === 'Other';

  return { formattedTrialClerks, showAlternateTrialClerkField };
};
