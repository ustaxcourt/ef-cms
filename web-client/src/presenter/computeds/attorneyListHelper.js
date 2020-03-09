import { state } from 'cerebral';

export const attorneyListHelper = get => {
  const practitionerUsers = get(state.practitionerUsers) || [];
  const respondentUsers = get(state.respondentUsers) || [];
  const inactivePractitionerUsers = get(state.inactivePractitionerUsers) || [];
  const inactiveRespondentUsers = get(state.inactiveRespondentUsers) || [];

  const attorneyUsers = practitionerUsers.concat(
    respondentUsers,
    inactivePractitionerUsers,
    inactiveRespondentUsers,
  );

  return {
    attorneyUsers,
  };
};
