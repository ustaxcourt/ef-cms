import { state } from '@web-client/presenter/app.cerebral';

export const setSubmittedAndCavCasesForJudgeAction = async ({
  props,
  store,
}: ActionProps) => {
  const { cases, consolidatedCasesGroupCountMap } = props;

  store.set(state.submittedAndCavCases.submittedAndCavCasesByJudge, cases);
  store.set(
    state.submittedAndCavCases.consolidatedCasesGroupCountMap,
    consolidatedCasesGroupCountMap,
  );
};
