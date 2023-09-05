import { state } from '@web-client/presenter/app.cerebral';

export const setSubmittedAndCavCasesForJudgeAction = ({
  props,
  store,
}: ActionProps<{
  cases: any[];
  consolidatedCasesGroupCountMap: Record<string, any>;
}>) => {
  const { cases, consolidatedCasesGroupCountMap } = props;

  store.set(state.submittedAndCavCases.submittedAndCavCasesByJudge, cases);
  store.set(
    state.submittedAndCavCases.consolidatedCasesGroupCountMap,
    consolidatedCasesGroupCountMap,
  );
};
