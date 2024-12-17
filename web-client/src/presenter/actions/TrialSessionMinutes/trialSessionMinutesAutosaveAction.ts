import { state } from '@web-client/presenter/app.cerebral';
import hash from 'object-hash';

export const trialSessionMinutesAutosaveAction = ({ get, props, store }) => {
  console.log('Autosaving...');

  // docketNumber, trialSessionId

  const minuteSheetFormState = get(state.minuteSheetForm);
  const minuteSheetFormStateSnapshot = get(state.minuteSheetFormSnapshot);
  const currentMinuteSheetFormStateSnapshot = hash(minuteSheetFormState);
  const hashesMatch =
    minuteSheetFormStateSnapshot === currentMinuteSheetFormStateSnapshot;

  console.log('Privious hash: ', minuteSheetFormStateSnapshot);
  console.log('Current Hash: ', currentMinuteSheetFormStateSnapshot);
  if (!hashesMatch) {
    console.log('Make network request to update hash (autosave)');
  } else {
    console.log('No changes!');
  }

  // const { key, name, section } = props;
  // const rows = get(state.minuteSheetForm[section][name]);
  // delete rows[key];
  // store.set(state.minuteSheetForm[section][name], rows);
};
