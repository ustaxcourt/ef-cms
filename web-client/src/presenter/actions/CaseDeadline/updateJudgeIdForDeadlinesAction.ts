import { state } from '@web-client/presenter/app.cerebral';

export const updateJudgeIdFilterForDeadlinesAction = ({
  get,
  store,
}: ActionProps) => {
  const judgeId = get(state.caseDeadlineReport.judgeIdFilter);
  store.set(state.screenMetadata.judgeId, judgeId);
};
