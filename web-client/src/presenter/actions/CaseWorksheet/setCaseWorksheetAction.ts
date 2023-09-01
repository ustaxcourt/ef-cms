import { state } from '@web-client/presenter/app.cerebral';

export const setCaseWorksheetAction = ({ get, props, store }: ActionProps) => {
  const { updatedWorksheet } = props;

  const worksheets = get(state.submittedAndCavCases.worksheets);

  const worksheetAlreadyExists = worksheets.findIndex(
    ws => ws.docketNumber === updatedWorksheet.docketNumber,
  );

  if (worksheetAlreadyExists !== -1) {
    store.set(
      state.submittedAndCavCases.worksheets[worksheetAlreadyExists],
      updatedWorksheet,
    );
  } else {
    store.set(state.submittedAndCavCases.worksheets, [
      ...worksheets,
      updatedWorksheet,
    ]);
  }
};
