import { state } from 'cerebral';

/**
 * set the state for the add edit notes modal
 *
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
}) => {
  const notes = get(state.trialSessionWorkingCopy.sessionNotes);
  const trialSessionDetail = get(state.trialSession);

  const startDate = applicationContext
    .getUtilities()
    .formatDateString(trialSessionDetail.startDate, 'MMDDYY');

  store.set(
    state.modal.heading,
    `${startDate}: ${trialSessionDetail.trialLocation}`,
  );
  store.set(state.modal.notes, notes);
};
