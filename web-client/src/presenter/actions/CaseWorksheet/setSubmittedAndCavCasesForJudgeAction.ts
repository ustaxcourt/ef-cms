import { state } from '@web-client/presenter/app.cerebral';

export const setSubmittedAndCavCasesForJudgeAction = ({
  props,
  store,
}: ActionProps<{
  cases: any[];
}>) => {
  const { cases } = props;

  store.set(state.submittedAndCavCases.submittedAndCavCasesByJudge, cases);
};
