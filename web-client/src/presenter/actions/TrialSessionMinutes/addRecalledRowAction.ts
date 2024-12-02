import { state } from '@web-client/presenter/app.cerebral';

export const addRecalledRowAction = ({ get, store }) => {
  const recalledRows = get(state.minuteSheetForm.caseMetadata.recalled);
  recalledRows.push({ date: '', note: '', transcriptOrdered: false });
  store.set(state.minuteSheetForm.caseMetadata.recalled, recalledRows);
};
