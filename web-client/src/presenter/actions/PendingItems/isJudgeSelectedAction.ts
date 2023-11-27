import { state } from '@web-client/presenter/app.cerebral';

export const isJudgeSelectedAction = ({ get, path }: ActionProps) => {
  const selectedJudge = get(state.pendingReports.selectedJudge);
  return selectedJudge ? path.yes() : path.no();
};
