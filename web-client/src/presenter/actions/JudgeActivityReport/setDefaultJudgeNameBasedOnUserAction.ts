import { state } from '@web-client/presenter/app.cerebral';

export const setDefaultJudgeNameBasedOnUserAction = ({
  get,
  store,
}: ActionProps) => {
  const judgeName = get(state.judgeUser.name);
  store.set(state.judgeActivityReport.filters.judgeName, judgeName);
};
