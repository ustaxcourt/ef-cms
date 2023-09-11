import { state } from '@web-client/presenter/app.cerebral';

export const setAddEditPrimaryIssueModalStateAction = ({
  get,
  props,
  store,
}: ActionProps<{
  docketNumber: string;
}>) => {
  const { docketNumber } = props;

  const { worksheets = [] } = get(state.submittedAndCavCases);

  const caseWorksheet = worksheets.find(ws => ws.docketNumber === docketNumber);

  const primaryIssue = caseWorksheet?.primaryIssue || '';

  store.set(state.modal.docketNumber, docketNumber);
  store.set(state.modal.primaryIssue, primaryIssue);
};
