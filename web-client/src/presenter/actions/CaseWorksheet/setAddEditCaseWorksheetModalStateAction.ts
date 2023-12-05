import { state } from '@web-client/presenter/app.cerebral';

export const setAddEditCaseWorksheetModalStateAction = ({
  get,
  props,
  store,
}: ActionProps<{
  docketNumber: string;
}>) => {
  const { docketNumber } = props;

  const { submittedAndCavCasesByJudge } = get(state.submittedAndCavCases);

  const caseWorksheet = submittedAndCavCasesByJudge.find(
    ws => ws.docketNumber === docketNumber,
  )?.caseWorksheet || { docketNumber };

  store.set(state.form, { ...caseWorksheet });
};
