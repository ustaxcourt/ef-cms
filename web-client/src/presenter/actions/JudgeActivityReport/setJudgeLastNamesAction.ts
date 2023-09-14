import { state } from '@web-client/presenter/app.cerebral';

export const setJudgeLastNamesAction = ({ get, store }: ActionProps) => {
  const { judgeName } = get(state.judgeActivityReport.filters);
  const judges = get(state.judges);

  const namesOfCurrentJudges = judges.map(judge => judge.name);

  const judgesToQueryFor =
    judgeName === 'All Judges' ? namesOfCurrentJudges : [judgeName];

  store.set(state.judgeActivityReport.filters.judges, judgesToQueryFor);
  store.set(
    state.judgeActivityReport.filters.judgeNameToDisplayForHeader,
    judgeName,
  );
};
