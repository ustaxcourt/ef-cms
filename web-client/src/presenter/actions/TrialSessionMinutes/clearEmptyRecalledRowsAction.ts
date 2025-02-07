import { state } from '@web-client/presenter/app.cerebral';

export const clearEmptyRecalledRowsAction = ({ get, store }) => {
  const minuteSheetForm = get(state.minuteSheetForm);
  const recalledRows = minuteSheetForm.caseMetadataSection.recalled;

  const nonEmptyRows = Object.entries(recalledRows).filter(
    ([key, row]) => row.date || row.note || row.transcriptOrdered,
  );

  // Filter empty rows
  const emptyRows = Object.entries(recalledRows).filter(
    ([key, row]) => !row.date && !row.note && !row.transcriptOrdered,
  );
  // Combine non-empty rows and the first empty row
  const newRecalledRows = [...nonEmptyRows, emptyRows[0]].reduce(
    (acc, [key, row]) => {
      acc[key] = row;
      return acc;
    },
    {},
  );

  store.set(
    state.minuteSheetForm.caseMetadataSection.recalled,
    newRecalledRows,
  );
};
