import { state } from '@web-client/presenter/app.cerebral';
import hash from 'object-hash';

export const saveMinuteSheetFormSnapshotAction = ({ get, store }) => {
  const minuteSheetFormState = get(state.minuteSheetForm);
  const hashedMinuteSheetFormState = hash(minuteSheetFormState);
  store.set(state.minuteSheetFormSnapshot, hashedMinuteSheetFormState);
};
