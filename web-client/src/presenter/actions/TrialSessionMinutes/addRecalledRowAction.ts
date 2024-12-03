import { state } from '@web-client/presenter/app.cerebral';
import { v4 as uuidv4 } from 'uuid';

export const addRecalledRowAction = ({ get, store }) => {
  const recalledRows = get(state.minuteSheetForm.caseMetadata.recalled);
  recalledRows.push({
    date: '',
    note: '',
    renderKey: uuidv4(),
    transcriptOrdered: false,
  });
  store.set(state.minuteSheetForm.caseMetadata.recalled, recalledRows);
};
