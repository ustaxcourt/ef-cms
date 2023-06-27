import { state } from '@web-client/presenter/app.cerebral';

export const resetJudgeNameForQueryAction = ({ get, store }: ActionProps) => {
  const { judgeName } = get(state.judgeActivityReport.filters);

  const judgeNameToQuery = judgeName === 'All Judges' ? '' : judgeName;
  store.set(state.judgeActivityReport.filters.judgeName, judgeNameToQuery);
};
