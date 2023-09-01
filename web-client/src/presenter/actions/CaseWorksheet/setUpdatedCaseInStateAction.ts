import { state } from '@web-client/presenter/app.cerebral';

export const setUpdatedCaseInStateAction = ({
  get,
  props,
  store,
}: ActionProps) => {
  const { updatedWorksheet } = props;

  const worksheets = get(state.submittedAndCavCases.worksheets);

  const index = worksheets.findIndex(
    ws => ws.docketNumber === updatedWorksheet.docketNumber,
  );

  if (index !== -1) {
    store.set(state.submittedAndCavCases.worksheets[index], updatedWorksheet);
  } else {
    worksheets.push(updatedWorksheet);
    store.set(state.submittedAndCavCases.worksheets, worksheets);
  }
};
