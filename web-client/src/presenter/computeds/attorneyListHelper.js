import { state } from 'cerebral';

export const attorneyListHelper = get => {
  const practitionerUsers = get(state.practitionerUsers);
  const respondentUsers = get(state.respondentUsers);

  const attorneyUsers = practitionerUsers.concat(respondentUsers);

  return {
    attorneyUsers,
  };
};
