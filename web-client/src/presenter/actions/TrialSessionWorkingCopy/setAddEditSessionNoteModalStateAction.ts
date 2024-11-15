import { state } from '@web-client/presenter/app.cerebral';

/**
 * set the state for the add edit notes modal
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {object} providers.get the cerebral get function
 * @param {object} providers.store the cerebral store
 * @param {object} providers.props the cerebral props object
 */
export const setAddEditSessionNoteModalStateAction = ({
  applicationContext,
  get,
  store,
}: ActionProps) => {
  const currentUser = get(state.user);
  const { USER_ROLES } = applicationContext.getConstants();
  const notes = get(state.trialSessionWorkingCopy.sessionNotes);
  const trialSessionDetails = get(state.trialSession);

  const startDate = applicationContext
    .getUtilities()
    .formatDateString(trialSessionDetails.startDate, 'MMDDYY');

  const notesLabel =
    currentUser.role === USER_ROLES.trialClerk ? 'User notes' : 'Judge’s notes';

  store.set(
    state.modal.heading,
    `${startDate}: ${trialSessionDetails.trialLocation}`,
  );
  store.set(state.modal.notes, notes);
  store.set(state.modal.notesLabel, notesLabel);
};
