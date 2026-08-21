import { state } from '@web-client/presenter/app.cerebral';
import { Get } from 'cerebral';
import { RawUser } from '@shared/business/entities/User';

export const sessionAssignmentHelper = (get: Get): any => {
  let formattedTrialClerks = get(state.trialClerks);
  formattedTrialClerks = [
    { name: 'Other', userId: 'Other' } as RawUser,
    ...formattedTrialClerks,
  ];

  const showAlternateTrialClerkField = get(state.form.trialClerkId) === 'Other';

  return { formattedTrialClerks, showAlternateTrialClerkField };
};
