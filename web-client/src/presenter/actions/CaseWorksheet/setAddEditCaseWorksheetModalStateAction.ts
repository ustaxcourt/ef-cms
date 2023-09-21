import { state } from '@web-client/presenter/app.cerebral';

export const setAddEditCaseWorksheetModalStateAction = ({
  get,
  props,
  store,
}: ActionProps<{
  docketNumber: string;
}>) => {
  const { docketNumber } = props;

  const { worksheets = [] } = get(state.submittedAndCavCases);

  const caseWorksheet = worksheets.find(
    ws => ws.docketNumber === docketNumber,
  ) || { docketNumber };

  store.set(state.form, { ...caseWorksheet });
};
