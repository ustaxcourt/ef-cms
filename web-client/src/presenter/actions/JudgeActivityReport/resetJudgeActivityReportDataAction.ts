import { state } from '@web-client/presenter/app.cerebral';

export const resetJudgeActivityReportDataAction = ({ store }: ActionProps) => {
  store.set(state.judgeActivityReport.judgeActivityReportData, {});
};
