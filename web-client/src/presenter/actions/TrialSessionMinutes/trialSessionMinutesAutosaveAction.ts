import { state } from '@web-client/presenter/app.cerebral';
import hash from 'object-hash';

export const trialSessionMinutesAutosaveAction = ({ get, store }) => {
  const currentMinuteSheetFormState = get(state.minuteSheetForm);
  const oldMinuteSheetFormStateSnapshot = get(state.minuteSheetFormSnapshot);
  const currentMinuteSheetFormStateSnapshot = hash(currentMinuteSheetFormState);
  const hasFormChanged =
    oldMinuteSheetFormStateSnapshot !== currentMinuteSheetFormStateSnapshot;

  if (hasFormChanged) {
    console.log('Make network request to update hash (autosave)');
  } else {
    console.log('No changes!');
  }

  store.set(state.minuteSheetFormSnapshot, currentMinuteSheetFormStateSnapshot);
};
