import { state } from '@web-client/presenter/app.cerebral';

export const checkJudgeActivityReportOpinionsAndOrdersIsSetAction = ({
  get,
  path,
}: ActionProps) => {
  const { opinions, orders } = get(
    state.judgeActivityReport.judgeActivityReportData,
  );

  if (opinions && orders) {
    return path.yes();
  } else return path.no();
};
