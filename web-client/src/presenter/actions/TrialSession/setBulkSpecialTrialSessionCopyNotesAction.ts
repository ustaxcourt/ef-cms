import { state } from '@web-client/presenter/app.cerebral';

export const setBulkSpecialTrialSessionCopyNotesAction = ({ props, store }) => {
  const specialTrialSessionCopyNotesObject =
    props.specialTrialSessionCopyNotes.reduce((acc, specialTrialSession) => {
      acc[specialTrialSession.trialSessionId] =
        specialTrialSession.sessionNotes;
      return acc;
    }, {});
  store.set(
    state.trialSessionsPage.specialTrialSessionCopyNotesObject,
    specialTrialSessionCopyNotesObject,
  );
};
