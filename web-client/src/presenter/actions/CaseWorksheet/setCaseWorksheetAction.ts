import { state } from '@web-client/presenter/app.cerebral';

export const setCaseWorksheetAction = ({ get, props, store }: ActionProps) => {
  const { updatedWorksheet } = props;

  const worksheets = get(state.submittedAndCavCases.worksheets);

  const worksheetAlreadyExists = worksheets.findIndex(
    ws => ws.docketNumber === updatedWorksheet.docketNumber,
  );
  console.log('worksheetAlreadyExists', worksheetAlreadyExists);
  if (worksheetAlreadyExists !== -1) {
    store.set(
      state.submittedAndCavCases.worksheets[worksheetAlreadyExists],
      updatedWorksheet,
    );

    console.log(
      'state.submittedAndCavCases.worksheets[worksheetAlreadyExists],updatedWorksheet,',
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
