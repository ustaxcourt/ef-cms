import { state } from '@web-client/presenter/app.cerebral';

import { Get } from '../../utilities/cerebralWrapper';
export const sessionAssignmentHelper = (get: Get): any => {
  let formattedTrialClerks = get(state.trialClerks);
  formattedTrialClerks = [
    { name: 'Other', userId: 'Other' },
    ...formattedTrialClerks,
  ];

  let showAlternateTrialClerkField = get(state.form.trialClerkId) === 'Other';

  return { formattedTrialClerks, showAlternateTrialClerkField };
};
