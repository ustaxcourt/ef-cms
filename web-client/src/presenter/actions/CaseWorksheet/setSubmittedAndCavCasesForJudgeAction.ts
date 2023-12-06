import { state } from '@web-client/presenter/app.cerebral';

export const setSubmittedAndCavCasesForJudgeAction = ({
  props,
  store,
}: ActionProps<{
  cases: (RawCase & {
    daysElapsedSinceLastStatusChange: number;
    formattedCaseCount: number;
  })[];
}>) => {
  const { cases } = props;

  store.set(state.submittedAndCavCases.submittedAndCavCasesByJudge, cases);
};
